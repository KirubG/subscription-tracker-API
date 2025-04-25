import { Schema, model } from "mongoose";

const subscriptionSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Subscription name is required"], // Fixed typo: 'require' -> 'required'
      minLength: [2, "Name must be at least 2 characters long"], // Added error message
      maxLength: [100, "Name cannot exceed 100 characters"], // Added error message
    },
    price: {
      type: Number,
      required: [true, "Subscription price is required"], // Fixed typo
      min: [0, "Price must be greater than or equal to 0"], // Improved message
    },
    currency: {
      type: String,
      enum: ["USD", "GBP", "EUR"],
      default: "USD",
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
      required: [true, "Frequency is required"], // Added required field
    },
    category: {
      type: String,
      enum: [
        "entertainment",
        "food",
        "health",
        "fitness",
        "education",
        "other",
      ],
      required: [true, "Subscription category is required"], // Fixed typo
    },
    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"], // Added error message
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "expired", "cancelled"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"], // Added error message
      validate: {
        validator: (value) => value <= new Date(),
        message: "Start date must be in the past or present", // Improved message
      },
    },
    renewalDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "Renewal date must be greater than start date",
      },
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"], // Added error message
    },
  },
  { timestamps: true }
);

// Middleware to set the renewal date based on frequency
subscriptionSchema.pre("save", function (next) {
  // Only calculate renewalDate if frequency and startDate are present
  if (this.frequency && this.startDate) {
    const frequencyMap = {
      daily: 1,
      weekly: 7,
      monthly: 30, // Note: This is approximate
      yearly: 365, // Note: This is approximate (doesn't account for leap years)
    };

    const frequencyDays = frequencyMap[this.frequency];
    if (frequencyDays !== undefined) {
      this.renewalDate = new Date(
        this.startDate.getTime() + frequencyDays * 24 * 60 * 60 * 1000
      );
    }
  }

  // Update status if renewalDate is in the past
  if (this.renewalDate && this.renewalDate < new Date()) {
    this.status = "expired";
  }

  next();
});

const Subscription = model("Subscription", subscriptionSchema);

export default Subscription;
