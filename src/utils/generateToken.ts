import { Response } from "express";
import jwt from "jsonwebtoken";

const generateToken = (res: Response, userId: any) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });

  // Set HTTP-Only Cookie (The "Air Alien" Security Layer)
  res.cookie("jwt", token, {
    httpOnly: true, // Client-side JS cannot read this (Prevents XSS)
    
    // 💡 FIX FOR MOBILE: Remove explicit sameSite in production. 
    // Browsers default to SameSite=Lax when omitted, which is much more compatible 
    // with cross-site redirects (like after login).
    secure: process.env.NODE_ENV !== "development", // Must be TRUE in production (Render)
    
    // If NOT in development, we rely on the browser's default SameSite policy (usually Lax or Strict)
    // We only set "strict" for local dev where it's safe.
    sameSite: process.env.NODE_ENV === "development" ? "strict" : 'lax', // Use Lax as a fallthrough, more compatible
    
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

export default generateToken;
