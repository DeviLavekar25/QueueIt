const { io } = require("socket.io-client");

const socket = io("http://localhost:5001");

socket.on("connect", () => {
    console.log("✅ Connected to Socket.IO Server");
});

socket.on("queueUpdated", (data) => {
    console.log("📢 Queue Updated!");
    console.log(data);
});

socket.on("disconnect", () => {
    console.log("❌ Disconnected from Server");
});