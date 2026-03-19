import { z } from "zod";
import { AuthConfig } from "../auth.js";
import { mapplsGet } from "../client.js";

export const reverseGeocodeSchema = z.object({
  lat: z.number().describe("Latitude"),
  lng: z.number().describe("Longitude"),
  lang: z.string().optional().describe("Response language (e.g. 'hi' for Hindi)"),
});

export type ReverseGeocodeInput = z.infer<typeof reverseGeocodeSchema>;

export async function reverseGeocode(
  auth: AuthConfig,
  input: ReverseGeocodeInput
): Promise<string> {
  const params: Record<string, string | number | boolean> = {
    lat: input.lat,
    lng: input.lng,
  };
  if (input.lang) params.lang = input.lang;

  const data = await mapplsGet(auth, "/rev_geocode", params);
  return JSON.stringify(data, null, 2);
}
