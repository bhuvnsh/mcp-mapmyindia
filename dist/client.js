import { getAccessToken } from "./auth.js";
const BASE = "https://apis.mappls.com/advancedmaps";
export async function mapplsGet(auth, path, params) {
    const token = await getAccessToken(auth);
    const query = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)]));
    query.append(auth.mode === "api_key" ? "rest_key" : "access_token", token);
    const url = `${BASE}${path}?${query.toString()}`;
    const res = await fetch(url);
    if (!res.ok) {
        const body = await res.text();
        throw new Error(`Mappls API error ${res.status}: ${body}`);
    }
    return res.json();
}
//# sourceMappingURL=client.js.map