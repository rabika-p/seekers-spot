import { ObjectId } from "mongodb";
import { IFoundItem } from "./FoundItem.types";

const FoundItem = require("../Model/");

//add a new found item
export async function addFoundItem(foundItem: IFoundItem) {
  try {
    const result = await FoundItem.create(foundItem);
    return { message: "Found Item record added successfully", result };
  } catch (error) {
    console.log(error);
  }
}

//view all found items and details from all posts
export const getFoundItems = async () => {
  try {
    const foundItems = await FoundItem.find({}).populate("postedBy", "username");
    // console.log(foundItems);
    return foundItems;
  } catch (e) {
    console.error(e);
  }
};

//view individual found item details from all posts
export async function getFoundItem(id: String) {
  try {
    const foundItem = await FoundItem.findById(id).populate(
      "postedBy",
      "username fullname _id"
    );
    return foundItem;
  } catch (e) {
    console.log(e);
  }
}

//get found items posted by logged in user
export const getFoundItemsByUser = async (userId: string) => {
  try {
    const foundItems = await FoundItem.find({ postedBy: userId });
    return foundItems;
  } catch (e) {
    console.error(e);
  }
};

// delete a specific found item
export const deleteFoundItem = async (foundItemId: string) => {
  try {
    return FoundItem.findByIdAndRemove(foundItemId).exec();
  } catch (e) {
    console.error(e);
  }
};

// edit a specific found item
export const editFoundItem = async (foundItemId: string, updatedData: any) => {
  try {
    return FoundItem.findByIdAndUpdate(foundItemId, updatedData);
  } catch (e) {
    console.error(e);
  }
};

// Update status of a found item
export const updateStatus = async (foundItemId: string, status: string) => {
  try {
    const updatedFoundItem = await FoundItem.findOneAndUpdate(
      { _id: foundItemId },
      { status },
      { new: true }
    );

    return { updatedFoundItem };
  } catch (e) {
    console.log(e);
  }
};
