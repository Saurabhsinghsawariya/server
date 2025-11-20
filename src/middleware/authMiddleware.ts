import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Define the custom Request interface to be used in Controllers
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    coupleId: string | null;
  };
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  // 1. Read the token from the Authorization Header (Bearer schema)
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Get token from header ("Bearer <token>")
      token = req.headers.authorization.split(" ")[1];

      // 2. Verify the token
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in .env");
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        userId: string;
        email: string;
        name: string;
        coupleId: string | null;
      };

      // 3. Attach user info to request
      // Note: We attach the decoded payload directly to save a DB call here.
      // The controllers will fetch the fresh User from DB if needed.
      req.user = {
        id: decoded.userId,
        email: decoded.email,
        name: decoded.name,
        coupleId: decoded.coupleId,
      };

      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
