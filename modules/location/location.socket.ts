import { Socket } from "socket.io";

import { updateLocation } from "./location.service.js";
import { logger } from "../../config/logger.js";

export default function registerLocationSocket(socket: Socket) {

    socket.on("join-room", (roomId: string) => {
        socket.join(roomId);
    });

    socket.on("location-update", async (payload) => {

        await updateLocation(socket.id, payload);

    });

    socket.on("disconnect", (reason) => {

        logger.info(
            `User ID - ${socket.data.user.id} disconnected. Reason: ${reason}`
        );

    });

}