import { describe, it, expect, beforeEach, vi } from "vitest";
import { geocode } from "../tools/geocode.js";
import { reverseGeocode } from "../tools/reverse-geocode.js";
import { placesSearch } from "../tools/places-search.js";
import { nearby } from "../tools/nearby.js";
import { directions } from "../tools/directions.js";
import { distanceMatrix } from "../tools/distance-matrix.js";
import { placeDetail } from "../tools/place-detail.js";

const apiKeyAuth = { mode: "api_key" as const, apiKey: "test-key" };

const mockSuccess = (body: unknown) =>
  vi.fn().mockResolvedValue({ ok: true, json: async () => body });

const mockFailure = (status: number, text: string) =>
  vi.fn().mockResolvedValue({ ok: false, status, text: async () => text });

beforeEach(() => vi.unstubAllGlobals());

describe("geocode", () => {
  it("calls geocode endpoint and returns JSON", async () => {
    const payload = { copResults: [{ latitude: 28.6, longitude: 77.2 }] };
    vi.stubGlobal("fetch", mockSuccess(payload));

    const result = await geocode(apiKeyAuth, { address: "India Gate, Delhi" });
    const parsed = JSON.parse(result);

    expect(parsed.copResults[0].latitude).toBe(28.6);
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain("/v1/geocode");
    expect(url).toContain("address=India+Gate%2C+Delhi");
    expect(url).toContain("rest_key=test-key");
  });

  it("passes optional pod and region params", async () => {
    vi.stubGlobal("fetch", mockSuccess({}));
    await geocode(apiKeyAuth, { address: "Delhi", pod: "CITY", region: "IND" });
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain("pod=CITY");
    expect(url).toContain("region=IND");
  });

  it("throws on API error", async () => {
    vi.stubGlobal("fetch", mockFailure(403, "Forbidden"));
    await expect(geocode(apiKeyAuth, { address: "x" })).rejects.toThrow(
      "Mappls API error 403"
    );
  });
});

describe("reverseGeocode", () => {
  it("calls rev_geocode endpoint with lat/lng", async () => {
    vi.stubGlobal("fetch", mockSuccess({ formatted_address: "India Gate" }));
    const result = await reverseGeocode(apiKeyAuth, { lat: 28.6129, lng: 77.2295 });
    const parsed = JSON.parse(result);
    expect(parsed.formatted_address).toBe("India Gate");
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain("/v1/rev_geocode");
    expect(url).toContain("lat=28.6129");
    expect(url).toContain("lng=77.2295");
  });
});

describe("placesSearch", () => {
  it("calls places endpoint with query", async () => {
    vi.stubGlobal("fetch", mockSuccess({ suggestedLocations: [] }));
    await placesSearch(apiKeyAuth, { query: "coffee" });
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain("/v1/places");
    expect(url).toContain("query=coffee");
  });

  it("includes location and radius when provided", async () => {
    vi.stubGlobal("fetch", mockSuccess({}));
    await placesSearch(apiKeyAuth, {
      query: "atm",
      location: "28.6,77.2",
      radius: 500,
    });
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain("location=28.6%2C77.2");
    expect(url).toContain("radius=500");
  });
});

describe("nearby", () => {
  it("calls nearby endpoint with required params", async () => {
    vi.stubGlobal("fetch", mockSuccess({ nearbyPlaces: [] }));
    await nearby(apiKeyAuth, { keywords: "hospital", refLocation: "28.6,77.2" });
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain("/v1/nearby");
    expect(url).toContain("keywords=hospital");
    expect(url).toContain("refLocation=28.6%2C77.2");
  });
});

describe("directions", () => {
  it("builds coordinates from origin and destination", async () => {
    vi.stubGlobal("fetch", mockSuccess({ routes: [] }));
    await directions(apiKeyAuth, {
      origin: "28.6,77.2",
      destination: "28.7,77.3",
    });
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain("/v1/direction/driving");
    expect(url).toContain("coordinates=28.6%2C77.2%3B28.7%2C77.3");
  });

  it("inserts waypoints between origin and destination", async () => {
    vi.stubGlobal("fetch", mockSuccess({}));
    await directions(apiKeyAuth, {
      origin: "28.6,77.2",
      destination: "28.8,77.4",
      waypoints: "28.7,77.3",
      profile: "biking",
    });
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain("/v1/direction/biking");
    expect(url).toContain("28.6%2C77.2%3B28.7%2C77.3%3B28.8%2C77.4");
  });
});

describe("distanceMatrix", () => {
  it("calls distance_matrix endpoint with origins and destinations", async () => {
    vi.stubGlobal("fetch", mockSuccess({ distances: [] }));
    await distanceMatrix(apiKeyAuth, {
      origins: "28.6,77.2|28.5,77.1",
      destinations: "28.7,77.3",
    });
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain("/v1/distance_matrix/driving");
    expect(url).toContain("origins=");
    expect(url).toContain("destinations=");
  });
});

describe("placeDetail", () => {
  it("calls eloc endpoint with the eLoc", async () => {
    vi.stubGlobal("fetch", mockSuccess({ placeAddress: "New Delhi" }));
    const result = await placeDetail(apiKeyAuth, { eLoc: "MMI000" });
    const parsed = JSON.parse(result);
    expect(parsed.placeAddress).toBe("New Delhi");
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain("/v1/eloc");
    expect(url).toContain("eLoc=MMI000");
  });
});
