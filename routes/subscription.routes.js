import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { createSubscription, getAllSubscriptions, getUserSubscriptions } from "../Controller/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get("/", authorize, getAllSubscriptions);


subscriptionRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  res.send(`Get Subscription with ID: ${id}`);
});


subscriptionRouter.post("/", authorize, createSubscription);


subscriptionRouter.put("/:id", (req, res) => {
  const { id } = req.params;
  const updatedSubscription = req.body;
  res.send(`Update Subscription with ID: ${id} to ${JSON.stringify(updatedSubscription)}`);
});
subscriptionRouter.delete("/:id", (req, res) => {
  const { id } = req.params;
  res.send(`Delete Subscription with ID: ${id}`);
});

subscriptionRouter.get("/user/:id", authorize, getUserSubscriptions);
subscriptionRouter.put("/:id/cancel", (req, res) => {
  const { id } = req.params;
  res.send(`Cancel Subscription with ID: ${id}`);
});
subscriptionRouter.get("/upcomingrenewals", (req, res) => {
  res.send("Get all upcoming renewals");
});



export default subscriptionRouter;