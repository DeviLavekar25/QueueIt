import {io} from "socket.io-client"

const socket = io("http://localhost:5001");

socket.on("connect", () => {
  console.log("Connected to Socket.IO:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected from Socket.IO");
});

export default socket;