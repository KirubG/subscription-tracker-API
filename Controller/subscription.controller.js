import Subscription from "../model/subscription.model.js";
import mongoose from "mongoose";

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
        ...req.body,
        user: req.user._id,
    });
    res.status(201).json({
      message: "Subscription created successfully",
      success: true,
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find({});
    res.status(200).json({
      message: "Subscriptions fetched successfully",
      success: true,
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
};
export const getUserSubscriptions = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(req.user);
    
    if(req.user.id !== id) {
      return res.status(403).json({
        message: "You are not authorized to view these subscriptions",
        success: false,
      });
    }
    const subscriptions = await Subscription.find({ user: req.params.id });
    res.status(200).json({
      message: "Subscriptions fetched successfully",
      success: true,
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
};