import { describe, it, expect, beforeEach, vi } from "vitest";
import { geocode } from "../tools/geocode.js";
import { reverseGeocode } from "../tools/reverse-geocode.js";
import { placesSearch } from "../tools/places-search.js";
import { nearby } from "../tools/nearby.js";
import { directions } from "../tools/directions.js";
import { distanceMatrix } from "../tools/distance-matrix.js";
import { placeDetail } from "../tools/place-detail.js";

const oauthAuth = { mode: "oauth" as const, clientId: "id", clientSecret: "secret" };

/** Stub fetch AND the OAuth token fetch in one go */
function stubFetchWithToken(apiResponse: unknown) {
  const mockFetch = vi.fn().mockImplementation((url: string) => {
    if (url.includes("oauth/token")) {
      return Promise.resolve({
        ok: true,
        json: async () => ({ access_token: "test-token", expires_in: 3600 }),
      });
    }
    return Promise.resolve({
      ok: true,
      json: async () => apiResponse,
    });
  });
  vi.stubGlobal("fetch", mockFetch);
  return mockFetch;
}

function stubFetchFailure(status: number, text: string) {
  const mockFetch = vi.fn().mockImplementation((url: string) => {
    if (url.includes("oauth/token")) {
      return Promise.resolve({
        ok: true,
        json: async () => ({ access_token: "test-token", expires_in: 3600 }),
      });
    }
    return Promise.resolve({ ok: false, status, text: async () => text });
  });
  vi.stubGlobal("fetch", mockFetch);
  return mockFetch;
}

/** Get the last non-OAuth fetch call URL */
function getApiCallUrl(mockFetch: ReturnType<typeof vi.fn>): string {
  const calls = mockFetch.mock.calls.filter(
    (c: [string]) => !c[0].includes("oauth/token")
  );
  return calls[calls.length - 1][0];
}

beforeEach(() => {
  vi.unstubAllGlobals();
  // Reset the cached OAuth token between tests
  vi.resetModules();
});

describe("geocode", () => {
  it("calls atlas geocode endpoint with Bearer auth", async () => {
    const mockFetch = stubFetchWithToken({ copResults: { latitude: 28.6 } });
    const result = await geocode(oauthAuth, { address: "India Gate, Delhi" });
    const parsed = JSON.parse(result);
    expect(parsed.copResults.latitude).toBe(28.6);

    const url = getApiCallUrl(mockFetch);
    expect(url).toContain("atlas.mappls.com/api/places/geocode");
    expect(url).toContain("address=India+Gate%2C+Delhi");

    // Check Bearer header was sent
    const apiCall = mockFetch.mock.calls.find(
      (c: [string]) => !c[0].includes("oauth/token")
    );
    expect(apiCall[1]?.headers?.Authorization).toBe("bearer test-token");
  });

  it("throws on API error", async () => {
    stubFetchFailure(403, "Forbidden");
    await expect(geocode(oauthAuth, { address: "x" })).rejects.toThrow("Mappls API error 403");
  });
});

describe("reverseGeocode", () => {
  it("calls advancedmaps rev_geocode with token in path", async () => {
    const mockFetch = stubFetchWithToken({ formatted_address: "India Gate" });
    const result = await reverseGeocode(oauthAuth, { lat: 28.6129, lng: 77.2295 });
    expect(JSON.parse(result).formatted_address).toBe("India Gate");

    const url = getApiCallUrl(mockFetch);
    expect(url).toContain("apis.mappls.com/advancedmaps/v1/test-token/rev_geocode");
    expect(url).toContain("lat=28.6129");
    expect(url).toContain("lng=77.2295");
  });
});

describe("placesSearch", () => {
  it("calls atlas search/json endpoint", async () => {
    const mockFetch = stubFetchWithToken({ suggestedLocations: [] });
    await placesSearch(oauthAuth, { query: "coffee" });
    const url = getApiCallUrl(mockFetch);
    expect(url).toContain("atlas.mappls.com/api/places/search/json");
    expect(url).toContain("query=coffee");
  });
});

describe("nearby", () => {
  it("calls atlas nearby/json endpoint", async () => {
    const mockFetch = stubFetchWithToken({ suggestedLocations: [] });
    await nearby(oauthAuth, { keywords: "hospital", refLocation: "28.6,77.2" });
    const url = getApiCallUrl(mockFetch);
    expect(url).toContain("atlas.mappls.com/api/places/nearby/json");
    expect(url).toContain("keywords=hospital");
  });
});

describe("directions", () => {
  it("uses route_adv with lng,lat order", async () => {
    const mockFetch = stubFetchWithToken({ routes: [] });
    await directions(oauthAuth, {
      origin: "28.6,77.2",
      destination: "28.7,77.3",
    });
    const url = getApiCallUrl(mockFetch);
    // route_adv endpoint with coords in lng,lat order
    expect(url).toContain("/route_adv/driving/77.2,28.6;77.3,28.7");
  });

  it("inserts waypoints and uses correct profile", async () => {
    const mockFetch = stubFetchWithToken({});
    await directions(oauthAuth, {
      origin: "28.6,77.2",
      destination: "28.8,77.4",
      waypoints: "28.7,77.3",
      profile: "biking",
    });
    const url = getApiCallUrl(mockFetch);
    expect(url).toContain("/route_adv/biking/77.2,28.6;77.3,28.7;77.4,28.8");
  });
});

describe("distanceMatrix", () => {
  it("puts coords in path with sources/destinations indices", async () => {
    const mockFetch = stubFetchWithToken({ distances: [] });
    await distanceMatrix(oauthAuth, {
      origins: "28.6,77.2",
      destinations: "28.7,77.3",
    });
    const url = getApiCallUrl(mockFetch);
    expect(url).toContain("/distance_matrix/driving/77.2,28.6;77.3,28.7");
    expect(url).toContain("sources=0");
    expect(url).toContain("destinations=1");
  });
});

describe("placeDetail", () => {
  it("calls explore O2O entity endpoint", async () => {
    const mockFetch = stubFetchWithToken({ name: "Connaught Place" });
    const result = await placeDetail(oauthAuth, { eLoc: "V66B2L" });
    expect(JSON.parse(result).name).toBe("Connaught Place");

    const url = getApiCallUrl(mockFetch);
    expect(url).toContain("explore.mappls.com/apis/O2O/entity/V66B2L");
  });
});
