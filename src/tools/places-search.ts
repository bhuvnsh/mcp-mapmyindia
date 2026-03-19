import { z } from "zod";
import { AuthConfig } from "../auth.js";
import { mapplsAtlas } from "../client.js";

export const placesSearchSchema = z.object({
  query: z.string().describe("Search keyword or place name"),
  location: z
    .string()
    .optional()
    .describe("Bias results near this lat,lng (e.g. '28.6139,77.2090')"),
  radius: z.number().optional().describe("Search radius in meters (max 10000)"),
  pod: z
    .enum(["SLC", "LC", "CITY", "VLG", "SDIST", "DIST", "STATE", "SSLC", "Res_com"])
    .optional()
    .describe("Place type filter"),
  filter: z.string().optional().describe("Restrict results, e.g. 'pin:110001'"),
  page: z.number().optional().describe("Page number for pagination"),
  region: z.string().optional().describe("ISO 3166-1 alpha-2 country code"),
});

export type PlacesSearchInput = z.infer<typeof placesSearchSchema>;

export async function placesSearch(
  auth: AuthConfig,
  input: PlacesSearchInput
): Promise<string> {
  const params: Record<string, string | number | boolean> = {
    query: input.query,
  };
  if (input.location) params.location = input.location;
  if (input.radius) params.radius = input.radius;
  if (input.pod) params.pod = input.pod;
  if (input.filter) params.filter = input.filter;
  if (input.page) params.page = input.page;
  if (input.region) params.region = input.region;

  const data = await mapplsAtlas(auth, "/search/json", params);
  return JSON.stringify(data, null, 2);
}
