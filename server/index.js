import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";

import "./config/mongo.js";
import { VerifyToken, VerifySocketToken } from "./middlewares/VerifyToken.js";
import chatRoomRoutes from "./routes/chatRoom.js";
import chatMessageRoutes from "./routes/chatMessage.js";
import userRoutes from "./routes/user.js";

dotenv.config();
const app = express();

app.use(cors({
  origin: "https://chat-app1-vert.vercel.app/",  // 🔑 Replace with your actual Vercel frontend URL
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(VerifyToken);

const PORT = process.env.PORT || 8080;

app.use("/api/room", chatRoomRoutes);
app.use("/api/message", chatMessageRoutes);
app.use("/api/user", userRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: "https://chat-app1-vert.vercel.app/",  // 🔑 Vercel URL
    credentials: true,
  },
});

io.use(VerifySocketToken);

global.onlineUsers = new Map();

const getKey = (map, val) => {
  for (let [key, value] of map.entries()) {
    if (value === val) return key;
  }
};

io.on("connection", (socket) => {
  global.chatSocket = socket;

  socket.on("addUser", (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit("getUsers", Array.from(onlineUsers));
  });

  socket.on("sendMessage", async ({ senderId, receiverId, message, chatRoomId }) => {
    // ✅ Save to DB
    try {
      const ChatMessage = (await import('./models/ChatMessage.js')).default;
      await ChatMessage.create({ chatRoomId, sender: senderId, message });
    } catch (err) {
      console.error("DB save failed", err);
    }

    const sendUserSocket = onlineUsers.get(receiverId);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("getMessage", {
        senderId,
        message,
      });
    }
  });

  socket.on("disconnect", () => {
    onlineUsers.delete(getKey(onlineUsers, socket.id));
    io.emit("getUsers", Array.from(onlineUsers));
  });
});
