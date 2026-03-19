import { z } from "zod";
import { AuthConfig } from "../auth.js";
export declare const directionsSchema: z.ZodObject<{
    origin: z.ZodString;
    destination: z.ZodString;
    waypoints: z.ZodOptional<z.ZodString>;
    profile: z.ZodOptional<z.ZodEnum<{
        driving: "driving";
        biking: "biking";
        walking: "walking";
        trucking: "trucking";
    }>>;
    alternatives: z.ZodOptional<z.ZodBoolean>;
    steps: z.ZodOptional<z.ZodBoolean>;
    geometries: z.ZodOptional<z.ZodEnum<{
        polyline: "polyline";
        polyline6: "polyline6";
        geojson: "geojson";
    }>>;
    overview: z.ZodOptional<z.ZodEnum<{
        full: "full";
        simplified: "simplified";
        false: "false";
    }>>;
    region: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type DirectionsInput = z.infer<typeof directionsSchema>;
export declare function directions(auth: AuthConfig, input: DirectionsInput): Promise<string>;
//# sourceMappingURL=directions.d.ts.map