import { z } from "zod";
import { AuthConfig } from "../auth.js";
export declare const reverseGeocodeSchema: z.ZodObject<{
    lat: z.ZodNumber;
    lng: z.ZodNumber;
    lang: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ReverseGeocodeInput = z.infer<typeof reverseGeocodeSchema>;
export declare function reverseGeocode(auth: AuthConfig, input: ReverseGeocodeInput): Promise<string>;
//# sourceMappingURL=reverse-geocode.d.ts.map