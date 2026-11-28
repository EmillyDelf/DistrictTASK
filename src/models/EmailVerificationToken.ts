import mongoose, { Schema, models, model } from "mongoose";

const EmailVerificationTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    tokenHash: {
      type: String,
      required: true,
      unique: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    usedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const EmailVerificationToken =
  models.EmailVerificationToken ||
  model("EmailVerificationToken", EmailVerificationTokenSchema);

export default EmailVerificationToken;