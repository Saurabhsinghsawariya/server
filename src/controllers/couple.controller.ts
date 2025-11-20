import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";

import Couple from "../models/Couple";
import User from "../models/User";



// Extend the Express Request type to include the user

declare global {

  namespace Express {

    interface Request {

      user?: any;

    }

  }

}



export const protect = async (req: Request, res: Response, next: NextFunction) => {

  let token;



  // 1. Read the token from the HTTP-Only Cookie

  token = req.cookies.jwt;



  if (token) {

    try {

      // 2. Verify the token using your secret

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);



      // 3. Fetch the user from DB (exclude password) and attach to req object

      req.user = await User.findById(decoded.userId).select("-password");



      next();

    } catch (error) {

      res.status(401);

      throw new Error("Not authorized, invalid token");

    }

  } else {

    res.status(401);

    throw new Error("Not authorized, no token");

  }

};

export const getMyStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const couple = await Couple.findOne({ users: userId }).populate('users', 'name email');
    if (!couple) {
      return res.status(200).json({ message: 'Not in a couple', couple: null });
    }
    res.status(200).json({ message: 'Couple found', couple });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const generateInvite = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    let couple = await Couple.findOne({ users: userId });
    if (!couple) {
      couple = new Couple({ users: [userId] });
    }
    if (couple.inviteCode) {
      return res.status(200).json({ message: 'Invite code already exists', inviteCode: couple.inviteCode });
    }
    const inviteCode = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    couple.inviteCode = inviteCode;
    await couple.save();
    res.status(200).json({ message: 'Invite code generated', inviteCode });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const joinCouple = async (req: Request, res: Response) => {
  try {
    const { inviteCode } = req.body;
    const userId = req.user._id;
    const couple = await Couple.findOne({ inviteCode });
    if (!couple) {
      return res.status(404).json({ message: 'Invalid invite code' });
    }
    if (couple.users.length >= 2) {
      return res.status(400).json({ message: 'Couple already has two users' });
    }
    if (couple.users.includes(userId)) {
      return res.status(400).json({ message: 'Already in this couple' });
    }
    couple.users.push(userId);
    await couple.save();
    res.status(200).json({ message: 'Joined couple successfully', couple });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
