# mcp-mapmyindia

<!-- mcp-name: io.github.bhuvnsh/mcp-mapmyindia -->

**MCP Server for Mappls / MapMyIndia APIs**

[![CI](https://github.com/bhuvnsh/mcp-mappls/actions/workflows/ci.yml/badge.svg)](https://github.com/bhuvnsh/mcp-mappls/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/mcp-mapmyindia.svg)](https://www.npmjs.com/package/mcp-mapmyindia)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server that exposes [Mappls / MapMyIndia](https://mappls.com) APIs as tools for AI assistants like Claude. Enables geocoding, reverse geocoding, place search, nearby discovery, routing, and distance calculations — all focused on India's mapping data.

---

## Tools

| Tool | Description |
|---|---|
| `geocode` | Convert an address or place name to coordinates |
| `reverse_geocode` | Convert coordinates (lat/lng) to a human-readable address |
| `places_search` | Autocomplete and search for places by query string |
| `nearby` | Discover nearby places by keyword around a reference location |
| `directions` | Get turn-by-turn directions between two points (supports waypoints) |
| `distance_matrix` | Compute travel distance and time between multiple origins and destinations |
| `place_detail` | Fetch detailed information for a place using its eLoc (Mappls place ID) |

---

## Setup

### Get API credentials

Register at [https://apis.mappls.com](https://apis.mappls.com) to get either:
- An **API key** (simpler, for personal/testing use)
- **OAuth client credentials** (recommended for production)

### Authentication

Set one of the following in your environment:

**Option A — API Key:**
```bash
export MAPPLS_API_KEY=your_api_key_here
```

**Option B — OAuth (Client Credentials):**
```bash
export MAPPLS_CLIENT_ID=your_client_id
export MAPPLS_CLIENT_SECRET=your_client_secret
```

---

## Usage with Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "mapmyindia": {
      "command": "npx",
      "args": ["-y", "mcp-mapmyindia"],
      "env": {
        "MAPPLS_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

Or with OAuth:

```json
{
  "mcpServers": {
    "mapmyindia": {
      "command": "npx",
      "args": ["-y", "mcp-mapmyindia"],
      "env": {
        "MAPPLS_CLIENT_ID": "your_client_id",
        "MAPPLS_CLIENT_SECRET": "your_client_secret"
      }
    }
  }
}
```

Config file location:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

---

## Development

```bash
# Clone and install
git clone https://github.com/bhuvnsh/mcp-mappls.git
cd mcp-mappls
npm install

# Build
npm run build

# Run tests
npm test

# Watch mode (dev)
npm run dev
```

### Requirements

- Node.js >= 18
- A Mappls API key or OAuth client credentials

---

## Contributing

Contributions are welcome. Please open an issue first to discuss what you'd like to change. Pull requests should include tests.

---

## License

[MIT](LICENSE)
