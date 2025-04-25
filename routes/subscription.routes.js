import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import {
  cancelSubscription,
  createSubscription,
  deleteAllSubscriptions,
  deleteSubscription,
  getAllSubscriptions,
  getSubscription,
  getUpcomingRenewals,
  getUserSubscriptions,
  updateSubscription,
} from "../Controller/subscription.controller.js";
import { deleteModel } from "mongoose";

const subscriptionRouter = Router();

subscriptionRouter.get("/", authorize, getAllSubscriptions);

subscriptionRouter.get("/:id", authorize, getSubscription);

subscriptionRouter.post("/", authorize, createSubscription);

// it finds the subscription buy using the user id
subscriptionRouter.get("/user/:id", authorize, getUserSubscriptions);

subscriptionRouter.put("/:id", authorize, updateSubscription);

subscriptionRouter.delete("/:id", authorize, deleteSubscription);

subscriptionRouter.delete("/", authorize, deleteAllSubscriptions);

subscriptionRouter.put("/:id/cancel", authorize, cancelSubscription);

subscriptionRouter.get("/upcomingrenewals", authorize, getUpcomingRenewals);

export default subscriptionRouter;
