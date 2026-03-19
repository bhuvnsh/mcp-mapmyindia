import { z } from "zod";
import { AuthConfig } from "../auth.js";
import { mapplsGet } from "../client.js";

export const nearbySchema = z.object({
  keywords: z.string().describe("Category or keyword to search nearby (e.g. 'atm', 'hospital')"),
  refLocation: z
    .string()
    .describe("Reference lat,lng (e.g. '28.6139,77.2090') or a eLoc/place-id"),
  radius: z.number().optional().describe("Search radius in meters (max 10000, default 1000)"),
  sortBy: z
    .enum(["dist:asc", "dist:desc", "imp"])
    .optional()
    .describe("Sort order"),
  page: z.number().optional().describe("Page number"),
  region: z.string().optional().describe("ISO 3166-1 alpha-2 country code"),
});

export type NearbyInput = z.infer<typeof nearbySchema>;

export async function nearby(auth: AuthConfig, input: NearbyInput): Promise<string> {
  const params: Record<string, string | number | boolean> = {
    keywords: input.keywords,
    refLocation: input.refLocation,
  };
  if (input.radius) params.radius = input.radius;
  if (input.sortBy) params.sortBy = input.sortBy;
  if (input.page) params.page = input.page;
  if (input.region) params.region = input.region;

  const data = await mapplsGet(auth, "/nearby", params);
  return JSON.stringify(data, null, 2);
}
