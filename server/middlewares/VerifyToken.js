import auth from "../config/firebase-config.js";

export const VerifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No Authorization header provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token format is invalid" });
    }

    const decodeValue = await auth.verifyIdToken(token);

    if (decodeValue) {
      req.user = decodeValue;
      return next();
    } else {
      return res.status(401).json({ message: "Invalid token" });
    }

  } catch (e) {
    console.error("Token verification error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const VerifySocketToken = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("No token provided in socket handshake"));
    }

    const decodeValue = await auth.verifyIdToken(token);

    if (decodeValue) {
      socket.user = decodeValue;
      return next();
    } else {
      return next(new Error("Invalid token"));
    }

  } catch (e) {
    console.error("Socket token verification error:", e);
    return next(new Error("Internal server error"));
  }
};
