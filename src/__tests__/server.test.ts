import { describe, it, expect, beforeEach, vi } from "vitest";
import { createServer } from "../server.js";

beforeEach(() => {
  process.env.MAPPLS_API_KEY = "test-key";
});

describe("createServer", () => {
  it("creates an MCP server without throwing", () => {
    expect(() => createServer()).not.toThrow();
  });

  it("server has expected name and version", () => {
    const server = createServer();
    // McpServer exposes these on its internal _serverInfo
    const info = (server as unknown as { _serverInfo: { name: string; version: string } })
      ._serverInfo;
    expect(info.name).toBe("mcp-mapmyindia");
    expect(info.version).toBe("0.1.0");
  });
});
