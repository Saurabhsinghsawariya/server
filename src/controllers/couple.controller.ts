// src/controllers/couple.controller.ts
import crypto from "crypto";
import { Response, NextFunction } from "express";
import { Couple } from "../models/Couple.model"; // Ensure correct path
import { User } from "../models/User.model";     // Ensure correct path
import { AuthRequest } from "../middleware/auth.middleware"; 

// Helper: Generate 6-digit code
const generateCode = () => {
  return crypto.randomBytes(3).toString("hex").toUpperCase(); // e.g., "A1B2C3"
};

// @desc    Generate Invite Code
// @route   POST /api/couple/generate
export const generateInvite = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
        res.status(401);
        throw new Error("Not authorized");
    }

    // 1. Check if user exists and is already paired
    const user = await User.findById(userId);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    if (user.coupleId) {
        res.status(400);
        throw new Error("You are already in a couple!");
    }

    // 2. Generate Code
    const code = generateCode();

    // 3. Create new Couple
    const newCouple = await Couple.create({
      users: [userId],
      inviteCode: code,
    });

    // 4. Update User with this coupleId
    user.coupleId = newCouple._id as any;
    await user.save();

    res.status(201).json({
      coupleId: newCouple._id,
      inviteCode: code,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Join via Invite Code
// @route   POST /api/couple/join
export const joinCouple = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { inviteCode } = req.body;
    const userId = req.user?.id;

    if (!userId) {
        res.status(401);
        throw new Error("Not authorized");
    }

    // 1. Find user and ensure they aren't already paired
    const user = await User.findById(userId);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    if (user.coupleId) {
        res.status(400);
        throw new Error("You are already in a couple!");
    }

    // 2. Find couple with this code
    const couple = await Couple.findOne({ inviteCode: inviteCode.toUpperCase() });

    if (!couple) {
      res.status(404);
      throw new Error("Invalid Invite Code");
    }

    if (couple.users.length >= 2) {
      res.status(400);
      throw new Error("This couple is already full!");
    }

    // 3. Add user to couple
    // We cast to any here because Mongoose Types vs String sometimes conflict in TS
    couple.users.push(userId as any);
    
    // NOTE: Do NOT set inviteCode to undefined if your Schema says it is required.
    // The check above (users.length >= 2) prevents new joins anyway.
    await couple.save();

    // 4. Update User
    user.coupleId = couple._id as any;
    await user.save();

    // 5. Populate for immediate frontend feedback
    const updatedCouple = await Couple.findById(couple._id).populate("users", "name email");

    res.status(200).json({
      message: "Connected successfully! ❤️",
      couple: updatedCouple,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Current User Data (Polished for Dashboard)
// @route   GET /api/couple/me
export const getMyStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
        res.status(401);
        throw new Error("Not authorized");
    }

    // 1. Find User
    const user = await User.findById(userId);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    // 2. Check Couple Status
    if (!user.coupleId) {
        // Return null couple data if not paired
        return res.status(200).json({ 
            ...user.toObject(), 
            couple: null 
        });
    }

    // 3. Find Couple
    const couple = await Couple.findById(user.coupleId).populate("users", "name email");

    // Edge Case: User has coupleId, but Couple doc was deleted
    if (!couple) {
        user.coupleId = null;
        await user.save();
        return res.status(200).json({ 
            ...user.toObject(), 
            couple: null 
        });
    }

    // 4. Filter out null users (in case a partner was deleted)
    const validUsers = couple.users.filter(u => u !== null);

    // 5. Return combined data
    res.json({
        ...couple.toObject(),
        users: validUsers
    });
  } catch (error) {
    next(error);
  }
};
