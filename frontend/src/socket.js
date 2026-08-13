import {io} from "socket.io-client"

const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5001");

socket.on("connect", () => {
  console.log("Connected to Socket.IO:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected from Socket.IO");
});

export default socket;