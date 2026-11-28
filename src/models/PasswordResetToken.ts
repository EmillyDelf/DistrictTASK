import mongoose, { Schema, models, model } from "mongoose";

const PasswordResetTokenSchema = new Schema(
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

const PasswordResetToken =
  models.PasswordResetToken ||
  model("PasswordResetToken", PasswordResetTokenSchema);

export default PasswordResetToken;