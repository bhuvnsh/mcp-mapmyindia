import { z } from "zod";
import { mapplsGet } from "../client.js";
export const distanceMatrixSchema = z.object({
    origins: z
        .string()
        .describe("Pipe-separated list of origin points as 'lat,lng' or eLoc (e.g. '28.6,77.2|28.7,77.3')"),
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
export async function distanceMatrix(auth, input) {
    const profile = input.profile ?? "driving";
    const params = {
        origins: input.origins,
        destinations: input.destinations,
    };
    if (input.region)
        params.region = input.region;
    if (input.rtype !== undefined)
        params.rtype = input.rtype;
    const data = await mapplsGet(auth, `/distance_matrix/${profile}`, params);
    return JSON.stringify(data, null, 2);
}
//# sourceMappingURL=distance-matrix.js.map