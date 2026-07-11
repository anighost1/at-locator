import redis from "../../config/redis.js";
import { STREAM_NAME } from "./location.queue.js";
import { createManyLocations } from "./location.repository.js";

export async function startLocationWorker() {

    while (true) {

        const result = await redis.xRead(
            {
                key: STREAM_NAME,
                id: "0",
            },
            {
                COUNT: 500,
                BLOCK: 2000,
            }
        );

        if (!result) continue;

        const locations: any[] = [];
        const ids: string[] = [];

        for (const stream of result) {

            for (const message of stream.messages) {

                ids.push(message.id);

                const values = message.message;

                locations.push({
                    userId: values.userId,
                    tripId: values.tripId,
                    latitude: Number(values.latitude),
                    longitude: Number(values.longitude),
                    speed: Number(values.speed),
                    heading: Number(values.heading),
                    accuracy: Number(values.accuracy),
                    recordedAt: new Date(values.recordedAt),
                });

            }

        }

        await createManyLocations(locations);

        if (ids.length) {
            await redis.xDel(STREAM_NAME, ids);
        }

    }

}