import { z } from "zod";
import { AuthConfig } from "../auth.js";
export declare const nearbySchema: z.ZodObject<{
    keywords: z.ZodString;
    refLocation: z.ZodString;
    radius: z.ZodOptional<z.ZodNumber>;
    sortBy: z.ZodOptional<z.ZodEnum<{
        "dist:asc": "dist:asc";
        "dist:desc": "dist:desc";
        imp: "imp";
    }>>;
    page: z.ZodOptional<z.ZodNumber>;
    region: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type NearbyInput = z.infer<typeof nearbySchema>;
export declare function nearby(auth: AuthConfig, input: NearbyInput): Promise<string>;
//# sourceMappingURL=nearby.d.ts.map