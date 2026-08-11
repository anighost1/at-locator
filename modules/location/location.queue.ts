import redis from "../../config/redis.js";
import { LocationPayload } from "./location.types.js";
import { createManyLocations } from "./location.repository.js";

const STREAM_NAME = "gps_stream";

export async function addLocation(data: LocationPayload) {
    await redis.xAdd("gps_stream", "*", {
        userId: String(data.userId),
        tripId: String(data.tripId ?? ""),
        latitude: String(data.latitude),
        longitude: String(data.longitude),
        speed: String(data.speed ?? 0),
        heading: String(data.heading ?? 0),
        accuracy: String(data.accuracy ?? 0),
        recordedAt: data.recordedAt,
    });
}

export { STREAM_NAME };

/**
 * Flush all pending stream entries for a given trip into the DB.
 * This reads the stream, filters messages for the tripId, writes them
 * to the DB using createManyLocations and removes the stream entries.
 */
export async function flushTripStream(tripId: number) {
    // Read entire stream (could be large); adjust COUNT if necessary
    const entries = await redis.xRange(STREAM_NAME, "-", "+");

    if (!entries || !entries.length) return;

    const locations: any[] = [];
    const ids: string[] = [];

    for (const message of entries) {
        const values = message.message;

        if (String(tripId) !== (values.tripId ?? "")) continue;

        ids.push(message.id);

        locations.push({
            userId: Number(values.userId),
            tripId: values.tripId ? Number(values.tripId) : null,
            latitude: Number(values.latitude),
            longitude: Number(values.longitude),
            speed: Number(values.speed),
            heading: Number(values.heading),
            accuracy: Number(values.accuracy),
            recordedAt: new Date(values.recordedAt),
        });
    }

    if (locations.length) {
        await createManyLocations(locations);
    }

    if (ids.length) {
        await redis.xDel(STREAM_NAME, ids);
    }

}