import app from "./app.js";
import http from "http";
import { env } from "./config/env.js";
import { Server } from "socket.io";
import { initSocket } from "./config/socket.js";
import registerLocationSocket from "./modules/location/location.socket.js";
import { startLocationWorker } from "./modules/location/location.worker.js";
import { socketAuth } from "./middlewares/socket.middleware.js";
import { logger } from "./config/logger.js";

startLocationWorker()

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    }
})
initSocket(io)

io.use(socketAuth);

io.on("connection", (socket) => {
    logger.info(`User ID - ${socket.data.user.id} with Socket ID - ${socket.id} connected`)
    registerLocationSocket(socket);
})

server.listen(env.PORT, () => {
    console.log(`AT Locator server running on port ${env.PORT}`);
});