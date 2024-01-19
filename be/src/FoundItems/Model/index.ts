import mongoose from "mongoose";

const foundItemsSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: [true, "Item name is required."] },
    category: { type: String, required: [true, "Category is required."] },
    description: { type: String, required: [true, "Description is required."] },
    date: { type: Date, required: [true, "Date is required."] },
    location: { type: String, required: [true, "Location is required."] },
    keywords: { type: String, required: [true, "Keywords are required."] },
    images: { type: [String]},
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      required: [true, "Status is required."],
      enum: ["Pending", "Matched"],
      default: "Pending"
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FoundItems", foundItemsSchema);
