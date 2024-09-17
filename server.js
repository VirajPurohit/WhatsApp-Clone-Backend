const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origins: "*",
  },
});

const PORT = process.env.port || 5000;

io.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  socket.join(id);
  socket.on("send-message", ({ recipients, text }) => {
    recipients.forEach((recipient) => {
      const newRecipients = recipients.filter((r) => r !== recipient);
      newRecipients.push(id);
      socket.broadcast.to(recipient).emit("recieve-message", {
        recipients: newRecipients,
        sender: id,
        text,
      });
    });
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`server running at port ${PORT}`);
});
