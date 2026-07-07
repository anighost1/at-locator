import { getIO } from "../../config/socket.js";

export function updateLocation(socketId: string, payload: Record<string, any>) {

    // Save if needed

    getIO()
        .to(payload.roomId)
        .emit("location-update", {
            userId: socketId,
            ...payload,
        });

}