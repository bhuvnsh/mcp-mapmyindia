import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { resolveAuth } from "./auth.js";
import { geocode, geocodeSchema } from "./tools/geocode.js";
import { reverseGeocode, reverseGeocodeSchema } from "./tools/reverse-geocode.js";
import { placesSearch, placesSearchSchema } from "./tools/places-search.js";
import { nearby, nearbySchema } from "./tools/nearby.js";
import { directions, directionsSchema } from "./tools/directions.js";
import { distanceMatrix, distanceMatrixSchema } from "./tools/distance-matrix.js";
import { placeDetail, placeDetailSchema } from "./tools/place-detail.js";

export function createServer(): McpServer {
  const auth = resolveAuth();
  const server = new McpServer({
    name: "mcp-mapmyindia",
    version: "0.1.0",
  });

  server.tool(
    "geocode",
    "Convert an address or place name to latitude/longitude coordinates using Mappls geocoding API",
    geocodeSchema.shape,
    async (input) => ({
      content: [{ type: "text", text: await geocode(auth, input) }],
    })
  );

  server.tool(
    "reverse_geocode",
    "Convert latitude/longitude coordinates to a human-readable address using Mappls reverse geocoding",
    reverseGeocodeSchema.shape,
    async (input) => ({
      content: [{ type: "text", text: await reverseGeocode(auth, input) }],
    })
  );

  server.tool(
    "places_search",
    "Search for places by keyword or category using Mappls Places API",
    placesSearchSchema.shape,
    async (input) => ({
      content: [{ type: "text", text: await placesSearch(auth, input) }],
    })
  );

  server.tool(
    "nearby",
    "Find nearby places of a specific category around a given location using Mappls Nearby API",
    nearbySchema.shape,
    async (input) => ({
      content: [{ type: "text", text: await nearby(auth, input) }],
    })
  );

  server.tool(
    "directions",
    "Get turn-by-turn driving/biking/walking directions between two or more points using Mappls Directions API",
    directionsSchema.shape,
    async (input) => ({
      content: [{ type: "text", text: await directions(auth, input) }],
    })
  );

  server.tool(
    "distance_matrix",
    "Calculate travel distances and durations between multiple origins and destinations using Mappls Distance Matrix API",
    distanceMatrixSchema.shape,
    async (input) => ({
      content: [{ type: "text", text: await distanceMatrix(auth, input) }],
    })
  );

  server.tool(
    "place_detail",
    "Get detailed information about a place using its Mappls eLoc (6-character place ID)",
    placeDetailSchema.shape,
    async (input) => ({
      content: [{ type: "text", text: await placeDetail(auth, input) }],
    })
  );

  return server;
}
