import mongoose from "mongoose";

const matchesSchema = new mongoose.Schema(
  {
    lostItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LostItems",
      required: true,
    },
    foundItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoundItems",
      required: true,
    },
    description: { type: String },
    // date: { type: Date, required: [true, "Date is required."] },

    status: {
      type: String,
      required: [true, "Status is required."],
      enum: ["Pending", "Matched", "Rejected", "Acknowledged"],
      default: "Pending"
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requestedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Matches", matchesSchema);
