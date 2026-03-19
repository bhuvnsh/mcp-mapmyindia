export type AuthMode = "api_key" | "oauth";
export interface AuthConfig {
    mode: AuthMode;
    apiKey?: string;
    clientId?: string;
    clientSecret?: string;
    accessToken?: string;
}
export declare function resolveAuth(): AuthConfig;
export declare function getAccessToken(auth: AuthConfig): Promise<string>;
export declare function authQueryParam(auth: AuthConfig, token: string): string;
//# sourceMappingURL=auth.d.ts.map