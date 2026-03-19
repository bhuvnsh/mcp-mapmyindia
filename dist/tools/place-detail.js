import { z } from "zod";
import { mapplsExplore } from "../client.js";
export const placeDetailSchema = z.object({
    eLoc: z
        .string()
        .describe("6-character Mappls eLoc (place ID) to look up, e.g. 'MMI000'"),
});
export async function placeDetail(auth, input) {
    const data = await mapplsExplore(auth, `/apis/O2O/entity/${input.eLoc}`);
    return JSON.stringify(data, null, 2);
}
//# sourceMappingURL=place-detail.js.map