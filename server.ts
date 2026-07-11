import app from "./app.js";
import http from "http";
import { env } from "./config/env.js";
import { Server } from "socket.io";
import { initSocket } from "./config/socket.js";
import registerLocationSocket from "./modules/location/location.socket.js";
import { startLocationWorker } from "./modules/location/location.worker.js";

startLocationWorker()
startLocationWorker()

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    }
})
initSocket(io)

io.on("connection", (socket) => {
    console.log(`${socket.id} connected`);
    registerLocationSocket(socket);
})

server.listen(env.PORT, () => {
    console.log(`AT Locator server running on port ${env.PORT}`);
});