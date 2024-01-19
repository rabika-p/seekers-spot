import mongoose from "mongoose";

export interface ILostItem {
  itemName: string;
  description: string;
  category: string;
  location: string;
  date: Date;
  keywords: string;
  images?: string[];
  postedBy: mongoose.Types.ObjectId;
  status: "Pending" | "Matched"; 
}
