import Subscription from "../model/subscription.model.js";
import {workflowClient} from "../config/upstash.js";
import { SERVER_URL } from "../config/env.js";

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
        ...req.body,
        user: req.user._id,
    });

   const workflowRunId = await workflowClient.trigger(
    {
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
      body: {
        subscriptionId: subscription.id,
      },
      headers: {
        "Content-Type": "application/json",
      },
      retries: 0,
    }
   );

    res.status(201).json({
      message: "Subscription created successfully",
      success: true,
      data: {subscription, workflowRunId},
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
export const getSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findById(id);
    if (!subscription) {
      return res.status(404).json({
        message: "Subscription not found",
        success: false,
      });
    }
    res.status(200).json({
      message: "Subscription fetched successfully",
      success: true,
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};
export const updateSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!subscription) {
      return res.status(404).json({
        message: "Subscription not found",
        success: false,
      });
    }
    res.status(200).json({
      message: "Subscription updated successfully",
      success: true,
      data: subscription,
    });
  }
  catch (error) {
    next(error);
  }
}
export const deleteSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findByIdAndDelete(id);
    if (!subscription) {
      return res.status(404).json({
        message: "Subscription not found",
        success: false,
      });
    }
    res.status(200).json({
      message: "Subscription deleted successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
export const deleteAllSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.deleteMany({});
    res.status(200).json({
      message: "All subscriptions deleted successfully",
      success: true,
      data: subscriptions,
    });
  }
  catch (error) {
    next(error);
  }
}
export const cancelSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findByIdAndUpdate(id, { status: "cancelled" }, { new: true });
    if (!subscription) {
      return res.status(404).json({
        message: "Subscription not found",
        success: false,
      });
    }
    res.status(200).json({
      message: "Subscription cancelled successfully",
      success: true,
      data: subscription,
    });
  }
  catch (error) {
    next(error);
  } 
}
export const getUpcomingRenewals = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find({ status: "active" });
    const upcomingRenewals = subscriptions.filter(subscription => {
      const renewalDate = new Date(subscription.renewalDate);
      const today = new Date();
      return renewalDate > today && renewalDate <= new Date(today.setDate(today.getDate() + 30));
    });
    res.status(200).json({
      message: "Upcoming renewals fetched successfully",
      success: true,
      data: upcomingRenewals,
    });
  } catch (error) {
    next(error);
  }
};