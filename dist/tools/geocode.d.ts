import { z } from "zod";
import { AuthConfig } from "../auth.js";
export declare const geocodeSchema: z.ZodObject<{
    address: z.ZodString;
    region: z.ZodOptional<z.ZodString>;
    pod: z.ZodOptional<z.ZodEnum<{
        SLC: "SLC";
        LC: "LC";
        CITY: "CITY";
        VLG: "VLG";
        SDIST: "SDIST";
        DIST: "DIST";
        STATE: "STATE";
        SSLC: "SSLC";
    }>>;
    bias: z.ZodOptional<z.ZodNumber>;
    filter: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GeocodeInput = z.infer<typeof geocodeSchema>;
export declare function geocode(auth: AuthConfig, input: GeocodeInput): Promise<string>;
//# sourceMappingURL=geocode.d.ts.map