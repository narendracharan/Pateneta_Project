const { Schema, model } = require("mongoose");

const pushNotificationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["ALL", "SELLER", "BUYER"],
      required: true,
    },
    image: {
      type: String,
      default: true,
    }
  },
  { timestamps: true }
);

const PushNotification = model("PushNotification", pushNotificationSchema);
module.exports = PushNotification;
