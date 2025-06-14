import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import fs from "fs/promises";

const data = await fs.readFile(new URL("./serviceAccountKey.json", import.meta.url), "utf-8");
const serviceAccountKey = JSON.parse(data);

const app = initializeApp({
  credential: cert(serviceAccountKey),
});

const auth = getAuth(app);

export default auth;
