import { z } from "zod";
import { AuthConfig } from "../auth.js";
import { mapplsGet } from "../client.js";

export const placeDetailSchema = z.object({
  eLoc: z
    .string()
    .describe("6-character Mappls eLoc (place ID) to look up, e.g. 'MMI000'"),
});

export type PlaceDetailInput = z.infer<typeof placeDetailSchema>;

export async function placeDetail(
  auth: AuthConfig,
  input: PlaceDetailInput
): Promise<string> {
  const data = await mapplsGet(auth, `/eloc`, { eLoc: input.eLoc });
  return JSON.stringify(data, null, 2);
}
