import { Socket } from "socket.io";

import { updateLocation } from "./location.service.js";

export default function registerLocationSocket(socket: Socket) {

    socket.on("join-room", (roomId) => {

        socket.join(roomId);

    });

    socket.on("location-update", (payload) => {
        updateLocation(socket.id, payload);

    });

}