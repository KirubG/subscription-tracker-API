import dayjs from "dayjs";
import { createRequire } from "module";
import Subscription from "../model/subscription.model.js";
import { sendReminderEmail } from "../utils/send-email.js";
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");

const Reminders = [7, 5, 2, 1]; // days before the renewal date

export const sendReminder = serve(async (context) => {
  const { subscriptionId } = context.requestPayload;
  const subscription = await fetchSubscription(context, subscriptionId);
  if (!subscription || subscription.status !== "active") return;

  const renewalDate = dayjs(subscription.renewalDate);

  if (renewalDate.isBefore(dayjs())) {
    console.log(`Subscription ${subscriptionId} is already expired`);
    return;
  }

  for (const reminder of Reminders) {
    const reminderDate = renewalDate.subtract(reminder, "day");

    if (reminderDate.isAfter(dayjs())) {
      console.log(
        `Scheduling reminder for ${subscriptionId} on ${reminderDate}`
      );
      await sleepUntilReminder(
        context,
        `Reminder:${reminder} days before`,
        reminderDate
      );
    }
    if (dayjs().isSame(reminderDate, "day")) {
      await triggerReminder(
        context,
        `${reminder} days before reminder`,
        subscription
      );
    }
  }
});

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run("get-subscription", async () => {
    return Subscription.findById(subscriptionId).populate({
      path: "user",
      select: "name email",
      options: { strictPopulate: false }, // Prevents errors if user is missing
    });
  });
};

const sleepUntilReminder = async (context, label, date) => {
  console.log(`Sleeping until ${date}`);
  await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (context, label, subscription) => {
  return await context.run(label, async () => {
    console.log(`triggering reminder for ${label}`);

    // Add null check for subscription.user before accessing email
    if (!subscription?.user?.email) {
      console.error(
        `Cannot send reminder - no email found for subscription ${subscription._id}`
      );
      return;
    }

    // send email or notification
    await sendReminderEmail({
      to: subscription.user.email,
      type: label,
      subscription: subscription,
    }).catch((error) => {
      console.error("Error sending email:", error);
    });
  });
};
