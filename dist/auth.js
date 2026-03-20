let cachedToken = null;
let tokenExpiresAt = 0;
export function _resetTokenCache() {
    cachedToken = null;
    tokenExpiresAt = 0;
}
export function resolveAuth() {
    const apiKey = process.env.MAPPLS_API_KEY;
    const clientId = process.env.MAPPLS_CLIENT_ID;
    const clientSecret = process.env.MAPPLS_CLIENT_SECRET;
    if (apiKey) {
        return { mode: "api_key", apiKey };
    }
    if (clientId && clientSecret) {
        return { mode: "oauth", clientId, clientSecret };
    }
    throw new Error("Auth not configured. Set MAPPLS_API_KEY for API key auth, " +
        "or MAPPLS_CLIENT_ID + MAPPLS_CLIENT_SECRET for OAuth.");
}
export async function getAccessToken(auth) {
    if (auth.mode === "api_key") {
        return auth.apiKey;
    }
    if (cachedToken && Date.now() < tokenExpiresAt - 60_000) {
        return cachedToken;
    }
    const params = new URLSearchParams({
        grant_type: "client_credentials",
        client_id: auth.clientId,
        client_secret: auth.clientSecret,
    });
    const res = await fetch("https://outpost.mappls.com/api/security/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
    });
    if (!res.ok) {
        throw new Error(`OAuth token fetch failed: ${res.status} ${await res.text()}`);
    }
    const data = (await res.json());
    cachedToken = data.access_token;
    tokenExpiresAt = Date.now() + data.expires_in * 1000;
    return cachedToken;
}
export function authQueryParam(auth, token) {
    return auth.mode === "api_key"
        ? `rest_key=${encodeURIComponent(token)}`
        : `access_token=${encodeURIComponent(token)}`;
}
//# sourceMappingURL=auth.js.map