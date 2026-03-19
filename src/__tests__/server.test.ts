import { describe, it, expect, beforeEach } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createServer } from "../server.js";

beforeEach(() => {
  process.env.MAPPLS_API_KEY = "test-key";
});

describe("createServer", () => {
  it("returns an McpServer instance", () => {
    const server = createServer();
    expect(server).toBeInstanceOf(McpServer);
  });

  it("server exposes connect and tool methods", () => {
    const server = createServer();
    expect(typeof server.connect).toBe("function");
    expect(typeof server.tool).toBe("function");
  });

  it("throws when no auth env vars are present", () => {
    delete process.env.MAPPLS_API_KEY;
    expect(() => createServer()).toThrow("Auth not configured");
  });
});
