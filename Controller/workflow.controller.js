import dayjs from "dayjs";
import { createRequire } from "module";
import Subscription from "../model/subscription.model.js";
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");

const Reminders = [7,5,2,1]; // days before the renewal date

export const sendReminder = serve(async (context) => {
  const { subscriptionId } = context.requestPayload;
  const subscription = await fetchSubscription(context, subscriptionId);
  if (!subscription || subscription.status !== "active") return;

  const renewalDate = dayjs(subscription.renewalDate);

  if (renewalDate.isBefore(dayjs())) {
    console.log(`Subscription ${subscriptionId} is already expired`);
    return;
  }

  
});

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run("get-subscription", () => {
    return Subscription.findById(subscriptionId).populate("user", "name email");
  });
};
