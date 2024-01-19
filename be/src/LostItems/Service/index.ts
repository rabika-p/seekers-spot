import { ObjectId } from "mongodb";
import * as LostItemRepository from "../Repository";
import { ILostItem } from "../Repository/LostItem.types";

//add a new lost item
export const addLostItem = async (lostItem: ILostItem) => {
  try {
    return await LostItemRepository.addLostItem(lostItem);
  } catch (error) {
    console.log(error);
  }
};

//view all lost items and details from all posts
export const getLostItems = async () => {
  try {
    const lostItems = await LostItemRepository.getLostItems();
    return lostItems;
  } catch (error) {
    console.log(error);
  }
};

//view individual lost item details from all posts
export const getLostItem = async (id: String) => {
  try {
    const userRequests = await LostItemRepository.getLostItem(id);
    return userRequests;
  } catch (e) {
    console.log(e);
  }
};

//get lost items posted by logged in user 
export const getLostItemsByUser = async (userId: string) => {
  try {
    const lostItems = await LostItemRepository.getLostItemsByUser(userId);
    return lostItems;
  } catch (error) {
    console.log(error);
  }
};

// delete a specific lost item
export const deleteLostItem = async (lostItemId: string) => {
  try {
      return LostItemRepository.deleteLostItem(lostItemId);
  } catch (error) {
      throw error;
  }
};

// edit a specific lost item
export const editLostItem = async (lostItemId: string, updatedData: any) => {
  try {
      return LostItemRepository.editLostItem(lostItemId, updatedData);
  } catch (error) {
      throw error;
  }
};

// update status of a lost item 
export const updateStatus = async (lostItemId: string, status: string) => {
  try {
    const updatedMatch = await LostItemRepository.updateStatus(lostItemId, status);
    return updatedMatch;
  } catch (error) {
    console.log(error);
  }
};

