import { AuthConfig } from "./auth.js";
/** atlas.mappls.com — Bearer token in Authorization header */
export declare function mapplsAtlas(auth: AuthConfig, path: string, params: Record<string, string | number | boolean>): Promise<unknown>;
/** apis.mappls.com/advancedmaps — token embedded in URL path */
export declare function mapplsAdvanced(auth: AuthConfig, path: string, params?: Record<string, string | number | boolean>): Promise<unknown>;
/** explore.mappls.com — Bearer token in Authorization header */
export declare function mapplsExplore(auth: AuthConfig, path: string): Promise<unknown>;
//# sourceMappingURL=client.d.ts.map