import { z } from "zod";
import { mapplsAdvanced } from "../client.js";
export const directionsSchema = z.object({
    origin: z
        .string()
        .describe("Start point as 'lat,lng' or eLoc (e.g. '28.6139,77.2090' or 'MMI000')"),
    destination: z
        .string()
        .describe("End point as 'lat,lng' or eLoc"),
    waypoints: z
        .string()
        .optional()
        .describe("Pipe-separated intermediate waypoints as 'lat,lng' or eLoc"),
    profile: z
        .enum(["driving", "biking", "walking", "trucking"])
        .optional()
        .describe("Routing profile (default: driving)"),
    alternatives: z.boolean().optional().describe("Request alternative routes"),
    steps: z.boolean().optional().describe("Include turn-by-turn steps"),
    geometries: z.enum(["polyline", "polyline6", "geojson"]).optional(),
    overview: z.enum(["full", "simplified", "false"]).optional(),
    region: z.string().optional().describe("ISO 3166-1 alpha-2 country code"),
});
function isELoc(point) {
    return !point.includes(",");
}
function toRoutePoint(point) {
    if (isELoc(point))
        return point;
    const [lat, lng] = point.split(",");
    return `${lng},${lat}`;
}
export async function directions(auth, input) {
    const profile = input.profile ?? "driving";
    const points = [input.origin];
    if (input.waypoints) {
        points.push(...input.waypoints.split("|"));
    }
    points.push(input.destination);
    const coords = points.map(toRoutePoint).join(";");
    const params = {};
    if (input.alternatives !== undefined)
        params.alternatives = input.alternatives;
    if (input.steps !== undefined)
        params.steps = input.steps;
    if (input.geometries)
        params.geometries = input.geometries;
    if (input.overview)
        params.overview = input.overview;
    if (input.region)
        params.region = input.region;
    const data = await mapplsAdvanced(auth, `/route_adv/${profile}/${coords}`, params);
    return JSON.stringify(data, null, 2);
}
//# sourceMappingURL=directions.js.map