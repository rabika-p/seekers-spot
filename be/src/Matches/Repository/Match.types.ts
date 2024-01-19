import { Types } from "mongoose";

export interface IMatch {
  lostItemId: Types.ObjectId;
  foundItemId: Types.ObjectId;
  // description: string;
  status: "Pending" | "Matched" | "Rejected" | "Acknowledged"; 
  requestedBy: Types.ObjectId;
  requestedTo: Types.ObjectId;
}
