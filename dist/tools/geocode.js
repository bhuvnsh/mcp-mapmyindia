import { z } from "zod";
import { mapplsGet } from "../client.js";
export const geocodeSchema = z.object({
    address: z.string().describe("Address or place name to geocode"),
    region: z.string().optional().describe("ISO 3166-1 alpha-2 country code (default: IND)"),
    pod: z
        .enum(["SLC", "LC", "CITY", "VLG", "SDIST", "DIST", "STATE", "SSLC"])
        .optional()
        .describe("Place type filter"),
    bias: z.number().optional().describe("1 to bias results to user location"),
    filter: z
        .string()
        .optional()
        .describe("Filter by state/district/city, e.g. 'pin:110001' or 'state:Haryana'"),
});
export async function geocode(auth, input) {
    const params = {
        address: input.address,
    };
    if (input.region)
        params.region = input.region;
    if (input.pod)
        params.pod = input.pod;
    if (input.bias)
        params.bias = input.bias;
    if (input.filter)
        params.filter = input.filter;
    const data = await mapplsGet(auth, "/geocode", params);
    return JSON.stringify(data, null, 2);
}
//# sourceMappingURL=geocode.js.map