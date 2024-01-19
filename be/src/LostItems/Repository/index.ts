import { ObjectId } from "mongodb";
import { ILostItem } from "./LostItem.types";

const LostItem = require("../Model/");

//add a new lost item
export async function addLostItem(lostItem: ILostItem) {
  try {
    const result = await LostItem.create(lostItem);
    return { message: "Lost Item record added successfully", result };
  } catch (error) {
    console.log(error);
  }
}

//view all lost items and details from all posts
export const getLostItems = async () => {
  try {
    const lostItems = await LostItem.find({}).populate("postedBy", "username");
    // console.log(lostItems);
    return lostItems;
  } catch (e) {
    console.error(e);
  }
};

//view individual lost item details from all posts
export async function getLostItem(id: String) {
  try {
    const lostItem = await LostItem.findById(id).populate(
      "postedBy",
      "username fullname _id"
    );
    return lostItem;
  } catch (e) {
    console.log(e);
  }
}

//get lost items posted by logged in user
export const getLostItemsByUser = async (userId: string) => {
  try {
    const lostItems = await LostItem.find({ postedBy: userId });
    return lostItems;
  } catch (e) {
    console.error(e);
  }
};

// delete a specific lost item
export const deleteLostItem = async (lostItemId: string) => {
  try {
    return LostItem.findByIdAndRemove(lostItemId).exec();
  } catch (e) {
    console.error(e);
  }
};

// edit a specific lost item
export const editLostItem = async (lostItemId: string, updatedData: any) => {
  try {
    return LostItem.findByIdAndUpdate(lostItemId, updatedData);
  } catch (e) {
    console.error(e);
  }
};

// update status of a lost item
export const updateStatus = async (lostItemId: string, status: string) => {
  try {
    const updatedLostItem = await LostItem.findOneAndUpdate(
      { _id: lostItemId },
      { status },
      { new: true }
    );

    return { updatedLostItem };
  } catch (e) {
    console.log(e);
  }
};


