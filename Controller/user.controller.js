import User from "../model/user.model.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRY } from "../config/env.js";

export const getUsers = async (req, res, next) => {
  try {
    let users = await User.find().select("-password -__v");
    res.json({
      success: true,
      users,
    });
  } catch (error) {
    next(error);
  }
};
export const getUser = async (req, res, next) => {
  try {
    let id = req.params.id;
    if (!id) {
      const error = new Error("User ID is required");
      error.statusCode = 400;
      throw error;
    }
    if (!mongoose.isValidObjectId(id)) {
      const error = new Error("Invalid User ID");
      error.statusCode = 400;
      throw error;
    }
    let user = await User.findById(id).select("-password -__v");
    if(!user){
        const error = new Error("User not found");
        error.statusCode = 404
        throw error;
    }
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
