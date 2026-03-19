import { z } from "zod";
import { AuthConfig } from "../auth.js";
export declare const placeDetailSchema: z.ZodObject<{
    eLoc: z.ZodString;
}, z.core.$strip>;
export type PlaceDetailInput = z.infer<typeof placeDetailSchema>;
export declare function placeDetail(auth: AuthConfig, input: PlaceDetailInput): Promise<string>;
//# sourceMappingURL=place-detail.d.ts.map