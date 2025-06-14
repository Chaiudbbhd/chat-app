import mongoose from "mongoose";

const ChatMessageSchema = new mongoose.Schema(
  {
    chatRoomId: { type: String, required: true },
    sender: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const ChatMessage = mongoose.model("ChatMessage", ChatMessageSchema);
export default ChatMessage;
