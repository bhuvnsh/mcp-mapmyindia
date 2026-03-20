import { z } from "zod";
import { AuthConfig } from "../auth.js";
import { mapplsAdvanced } from "../client.js";

export const distanceMatrixSchema = z.object({
  origins: z
    .string()
    .describe(
      "Pipe-separated list of origin points as 'lat,lng' or eLoc (e.g. '28.6,77.2|28.7,77.3')"
    ),
  destinations: z
    .string()
    .describe("Pipe-separated list of destination points as 'lat,lng' or eLoc"),
  profile: z
    .enum(["driving", "biking", "walking", "trucking"])
    .optional()
    .describe("Routing profile (default: driving)"),
  region: z.string().optional().describe("ISO 3166-1 alpha-2 country code"),
  rtype: z
    .number()
    .optional()
    .describe("Route type: 0 = optimal (default), 1 = shortest"),
});

export type DistanceMatrixInput = z.infer<typeof distanceMatrixSchema>;

function flipCoord(latLng: string): string {
  const [lat, lng] = latLng.split(",");
  return `${lng},${lat}`;
}

export async function distanceMatrix(
  auth: AuthConfig,
  input: DistanceMatrixInput
): Promise<string> {
  const profile = input.profile ?? "driving";

  const originPts = input.origins.split("|").map(flipCoord);
  const destPts = input.destinations.split("|").map(flipCoord);
  const allCoords = [...originPts, ...destPts].join(";");

  const sourceIndices = originPts.map((_, i) => i).join(",");
  const destIndices = destPts.map((_, i) => i + originPts.length).join(",");

  const params: Record<string, string | number | boolean> = {
    sources: sourceIndices,
    destinations: destIndices,
  };
  if (input.region) params.region = input.region;
  if (input.rtype !== undefined) params.rtype = input.rtype;

  const data = await mapplsAdvanced(auth, `/distance_matrix/${profile}/${allCoords}`, params);
  return JSON.stringify(data, null, 2);
}
