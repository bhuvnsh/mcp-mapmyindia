import { z } from "zod";
import { AuthConfig } from "../auth.js";
export declare const placesSearchSchema: z.ZodObject<{
    query: z.ZodString;
    location: z.ZodOptional<z.ZodString>;
    radius: z.ZodOptional<z.ZodNumber>;
    pod: z.ZodOptional<z.ZodEnum<{
        SLC: "SLC";
        LC: "LC";
        CITY: "CITY";
        VLG: "VLG";
        SDIST: "SDIST";
        DIST: "DIST";
        STATE: "STATE";
        SSLC: "SSLC";
        Res_com: "Res_com";
    }>>;
    filter: z.ZodOptional<z.ZodString>;
    page: z.ZodOptional<z.ZodNumber>;
    region: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type PlacesSearchInput = z.infer<typeof placesSearchSchema>;
export declare function placesSearch(auth: AuthConfig, input: PlacesSearchInput): Promise<string>;
//# sourceMappingURL=places-search.d.ts.map