#!/usr/bin/env node
/**
 * MCP server entry point for Smithery.ai compatibility
 * This provides direct MCP protocol access without requiring an API
 */

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import log from '@apify/log';
import { ActorsMcpServer } from './mcp/server.js';
import { processInput } from './input.js';
import type { Input, ToolSelector } from './types.js';
import { parseCommaSeparatedList } from './utils/generic.js';
import { loadToolsFromInput } from './utils/tools-loader.js';

// Configure logging - set to ERROR to avoid polluting stdio
log.setLevel(log.LEVELS.ERROR);

// Propagate errors to stderr for debugging
const originalError = log.error.bind(log);
log.error = (...args: Parameters<typeof log.error>) => {
    originalError(...args);
    console.error(...args);
};

async function main() {
    try {
        // Get configuration from environment variables
        const apifyToken = process.env.APIFY_TOKEN;
        
        // For Smithery, the token is required
        if (!apifyToken) {
            log.error('APIFY_TOKEN environment variable is required');
            process.exit(1);
        }

        // Create the MCP server
        const mcpServer = new ActorsMcpServer();

        // Parse configuration from environment variables
        const actors = process.env.ACTORS ? parseCommaSeparatedList(process.env.ACTORS) : undefined;
        const tools = process.env.TOOLS ? parseCommaSeparatedList(process.env.TOOLS) : [];
        const enableAddingActors = process.env.ENABLE_ADDING_ACTORS === 'true';

        // Create input configuration
        const input: Input = {
            actors,
            enableAddingActors,
            tools: tools as ToolSelector[],
        };

        // Process and normalize the input
        const normalized = processInput(input);

        // Load tools based on configuration
        const loadedTools = await loadToolsFromInput(normalized, apifyToken);

        // Add tools to the server
        mcpServer.upsertTools(loadedTools);

        // Create stdio transport and connect
        const transport = new StdioServerTransport();
        await mcpServer.connect(transport);

        // Keep the process alive
        process.stdin.resume();

    } catch (error) {
        log.error('Failed to start MCP server', { error });
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    process.exit(0);
});

process.on('SIGTERM', () => {
    process.exit(0);
});

// Start the server
main();