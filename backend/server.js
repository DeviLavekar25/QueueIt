require("dotenv").config();
const http = require("http");
const app = require("./src/app");
const connectDB = require("./src/config/db");
const { Server } = require("socket.io");
const {initializeSocket} = require("./src/sockets/socket")

connectDB();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

initializeSocket(io);

io.on("connection", (socket) => {
    console.log("New Client Connected");

     socket.on("joinQueue", (queueId) => {
        socket.join(`queue_${queueId}`);

        console.log(
            `Socket ${socket.id} joined queue_${queueId}`
        );
    });

    socket.on("leaveQueue", (queueId) => {
        socket.leave(`queue_${queueId}`);

        console.log(
            `Socket ${socket.id} left queue_${queueId}`
        );
    });

    socket.on("disconnect", () => {
        console.log("Client Disconnected");
    });

});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server Running On Port ${PORT}`);
});