import { describe, it, expect, beforeEach, vi } from "vitest";
import { resolveAuth, getAccessToken } from "../auth.js";

describe("resolveAuth", () => {
  beforeEach(() => {
    delete process.env.MAPPLS_API_KEY;
    delete process.env.MAPPLS_CLIENT_ID;
    delete process.env.MAPPLS_CLIENT_SECRET;
  });

  it("returns api_key mode when MAPPLS_API_KEY is set", () => {
    process.env.MAPPLS_API_KEY = "test-key-123";
    const auth = resolveAuth();
    expect(auth.mode).toBe("api_key");
    expect(auth.apiKey).toBe("test-key-123");
  });

  it("returns oauth mode when client credentials are set", () => {
    process.env.MAPPLS_CLIENT_ID = "client-id";
    process.env.MAPPLS_CLIENT_SECRET = "client-secret";
    const auth = resolveAuth();
    expect(auth.mode).toBe("oauth");
    expect(auth.clientId).toBe("client-id");
    expect(auth.clientSecret).toBe("client-secret");
  });

  it("prefers api_key over oauth when both are set", () => {
    process.env.MAPPLS_API_KEY = "key";
    process.env.MAPPLS_CLIENT_ID = "id";
    process.env.MAPPLS_CLIENT_SECRET = "secret";
    const auth = resolveAuth();
    expect(auth.mode).toBe("api_key");
  });

  it("throws when no auth env vars are set", () => {
    expect(() => resolveAuth()).toThrow("Auth not configured");
  });
});

describe("getAccessToken", () => {
  it("returns apiKey directly for api_key mode", async () => {
    const auth = { mode: "api_key" as const, apiKey: "my-api-key" };
    const token = await getAccessToken(auth);
    expect(token).toBe("my-api-key");
  });

  it("fetches and caches OAuth token", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ access_token: "oauth-token-xyz", expires_in: 3600 }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const auth = {
      mode: "oauth" as const,
      clientId: "id",
      clientSecret: "secret",
    };

    const token1 = await getAccessToken(auth);
    const token2 = await getAccessToken(auth); // should hit cache

    expect(token1).toBe("oauth-token-xyz");
    expect(token2).toBe("oauth-token-xyz");
    expect(mockFetch).toHaveBeenCalledTimes(1); // fetched only once

    vi.unstubAllGlobals();
  });

  it("throws on OAuth token fetch failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => "Unauthorized",
    }));

    const auth = { mode: "oauth" as const, clientId: "bad", clientSecret: "creds" };
    await expect(getAccessToken(auth)).rejects.toThrow("OAuth token fetch failed: 401");

    vi.unstubAllGlobals();
  });
});
