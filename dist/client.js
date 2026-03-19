import { getAccessToken } from "./auth.js";
const BASE = "https://apis.mappls.com/advancedmaps";
export async function mapplsGet(auth, path, params) {
    const token = await getAccessToken(auth);
    const query = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)]));
    // API key is embedded in the URL path: /v1/{key}/geocode
    // OAuth token goes as a query param: /v1/geocode?access_token=...
    let url;
    if (auth.mode === "api_key") {
        url = `${BASE}/v1/${token}${path}?${query.toString()}`;
    }
    else {
        query.append("access_token", token);
        url = `${BASE}/v1${path}?${query.toString()}`;
    }
    const res = await fetch(url);
    if (!res.ok) {
        const body = await res.text();
        throw new Error(`Mappls API error ${res.status}: ${body}`);
    }
    return res.json();
}
//# sourceMappingURL=client.js.map