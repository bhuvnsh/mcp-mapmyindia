import { z } from "zod";
import { AuthConfig } from "../auth.js";
export declare const distanceMatrixSchema: z.ZodObject<{
    origins: z.ZodString;
    destinations: z.ZodString;
    profile: z.ZodOptional<z.ZodEnum<{
        driving: "driving";
        biking: "biking";
        walking: "walking";
        trucking: "trucking";
    }>>;
    region: z.ZodOptional<z.ZodString>;
    rtype: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type DistanceMatrixInput = z.infer<typeof distanceMatrixSchema>;
export declare function distanceMatrix(auth: AuthConfig, input: DistanceMatrixInput): Promise<string>;
//# sourceMappingURL=distance-matrix.d.ts.map