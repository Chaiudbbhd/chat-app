import mongoose from "mongoose";

const ChatRoomSchema = new mongoose.Schema(
  {
    members: { type: [String], required: true },
  },
  { timestamps: true }
);

const ChatRoom = mongoose.model("ChatRoom", ChatRoomSchema);
export default ChatRoom;
