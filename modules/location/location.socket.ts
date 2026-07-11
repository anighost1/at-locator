import { Socket } from "socket.io";

import { updateLocation } from "./location.service.js";

export default function registerLocationSocket(socket: Socket) {

    socket.on("join-room", (roomId: string) => {
        socket.join(roomId);
    });

    socket.on("location-update", async (payload) => {

        await updateLocation(socket.id, payload);

    });

}