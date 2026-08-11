import { getIO } from "../../config/socket.js";

import { addLocation } from "./location.queue.js";
import { setLatestLocation } from "./location.cache.js";

import { LocationPayload } from "./location.types.js";

export async function updateLocation(
    socketId: string,
    payload: LocationPayload
) {

    await setLatestLocation(payload);

    await addLocation(payload);

    getIO()
        .to(payload.roomId)
        .emit("location-update", {
            socketId,
            ...payload,
        });

}