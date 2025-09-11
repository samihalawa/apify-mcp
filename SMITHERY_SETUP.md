# Smithery.ai Setup for Apify MCP Server

This guide explains how to use the Apify MCP Server with Smithery.ai.

## Prerequisites

1. Node.js >= 18.0.0
2. An Apify API token (get one from [Apify Console](https://console.apify.com/account/integrations))
3. A Smithery.ai account

## Installation

1. Clone and build the repository:
```bash
git clone https://github.com/apify/apify-mcp-server.git
cd apify-mcp-server
npm install
npm run build
```

## Smithery Configuration

The `smithery.yaml` file is already configured for Smithery.ai compatibility. It provides the following configuration options:

- **apifyToken** (required): Your Apify API token
- **actors** (optional): Comma-separated list of Actor names to load at startup
- **enableAddingActors** (optional): Enable dynamic actor loading
- **tools** (optional): Comma-separated list of tool categories to enable

## Usage with Smithery.ai

### Option 1: Deploy via GitHub

1. Fork this repository to your GitHub account
2. In Smithery.ai, add your forked repository
3. Configure your Apify token in Smithery's environment settings
4. The MCP server will be available for use

### Option 2: Local Development

For testing locally with the MCP inspector:

```bash
# Set your Apify token
export APIFY_TOKEN=your_apify_token

# Test with MCP inspector
npx @modelcontextprotocol/inspector dist/mcp.js
```

## Available Tool Categories

- **actors**: Tools for running Apify Actors
- **docs**: Search and fetch Apify documentation  
- **datasets**: Manage datasets and results
- **key-value stores**: Handle key-value storage

## Example Configuration

```yaml
# Minimal configuration (no tools loaded by default)
apifyToken: "your_token_here"

# Load specific actors at startup
apifyToken: "your_token_here"
actors: "apify/google-search-scraper,apify/instagram-scraper"

# Enable all actor tools
apifyToken: "your_token_here"
tools: "actors"

# Enable multiple tool categories
apifyToken: "your_token_here"
tools: "actors,docs,datasets"
```

## Direct MCP Usage

The server can also be used directly via stdio:

```bash
# With environment variables
APIFY_TOKEN=your_token node dist/mcp.js

# With specific tools
APIFY_TOKEN=your_token TOOLS=actors,docs node dist/mcp.js

# With specific actors
APIFY_TOKEN=your_token ACTORS=apify/google-search-scraper node dist/mcp.js
```

## Troubleshooting

1. **"APIFY_TOKEN is required"**: Make sure your Apify token is set in the environment or Smithery configuration
2. **"User was not found or authentication token is not valid"**: Check that your Apify token is valid
3. **Tools not loading**: Start with an empty tools configuration and add them gradually

## Support

For issues related to:
- Apify MCP Server: [GitHub Issues](https://github.com/apify/apify-mcp-server/issues)
- Smithery.ai: [Smithery Support](https://smithery.ai/support)
- Apify Platform: [Apify Support](https://apify.com/support)