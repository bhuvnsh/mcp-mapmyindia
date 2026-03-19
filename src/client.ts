import { AuthConfig, getAccessToken } from "./auth.js";

const ATLAS_BASE = "https://atlas.mappls.com/api/places";
const ADVANCED_BASE = "https://apis.mappls.com/advancedmaps/v1";
const EXPLORE_BASE = "https://explore.mappls.com";

async function handleResponse(res: Response): Promise<unknown> {
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Mappls API error ${res.status}: ${body}`);
  }
  return res.json();
}

/** atlas.mappls.com — Bearer token in Authorization header */
export async function mapplsAtlas(
  auth: AuthConfig,
  path: string,
  params: Record<string, string | number | boolean>
): Promise<unknown> {
  const token = await getAccessToken(auth);
  const query = new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)])
  );
  const url = `${ATLAS_BASE}${path}?${query.toString()}`;
  const res = await fetch(url, {
    headers: { Authorization: `bearer ${token}` },
  });
  return handleResponse(res);
}

/** apis.mappls.com/advancedmaps — token embedded in URL path */
export async function mapplsAdvanced(
  auth: AuthConfig,
  path: string,
  params?: Record<string, string | number | boolean>
): Promise<unknown> {
  const token = await getAccessToken(auth);
  const query = params
    ? new URLSearchParams(
        Object.entries(params).map(([k, v]) => [k, String(v)])
      )
    : null;
  const url = query
    ? `${ADVANCED_BASE}/${token}${path}?${query.toString()}`
    : `${ADVANCED_BASE}/${token}${path}`;
  const res = await fetch(url);
  return handleResponse(res);
}

/** explore.mappls.com — Bearer token in Authorization header */
export async function mapplsExplore(
  auth: AuthConfig,
  path: string
): Promise<unknown> {
  const token = await getAccessToken(auth);
  const url = `${EXPLORE_BASE}${path}`;
  const res = await fetch(url, {
    headers: { Authorization: `bearer ${token}` },
  });
  return handleResponse(res);
}
