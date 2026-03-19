import { z } from "zod";
import { mapplsGet } from "../client.js";
export const placeDetailSchema = z.object({
    eLoc: z
        .string()
        .describe("6-character Mappls eLoc (place ID) to look up, e.g. 'MMI000'"),
});
export async function placeDetail(auth, input) {
    const data = await mapplsGet(auth, `/v1/eloc`, { eLoc: input.eLoc });
    return JSON.stringify(data, null, 2);
}
//# sourceMappingURL=place-detail.js.map