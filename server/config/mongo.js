import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not defined. Please check your .env file.");
  process.exit(1);
}

mongoose.set('strictQuery', true); // or false depending on your preference

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Mongo has connected successfully"))
.catch((error) => {
  console.error("❌ Mongo connection error:", error);
  process.exit(1);
});

mongoose.connection.on("reconnected", () => {
  console.log("🔄 Mongo has reconnected");
});
mongoose.connection.on("error", (error) => {
  console.error("❌ Mongo connection error:", error);
});
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ Mongo connection is disconnected");
});
