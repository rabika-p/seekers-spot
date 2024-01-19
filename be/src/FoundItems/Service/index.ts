import { ObjectId } from "mongodb";
import * as FoundItemRepository from "../Repository";
import { IFoundItem } from "../Repository/FoundItem.types";

//add a new found item
export const addFoundItem = async (foundItem: IFoundItem) => {
  try {
    return await FoundItemRepository.addFoundItem(foundItem);
  } catch (error) {
    console.log(error);
  }
};

//view all found items and details from all posts
export const getFoundItems = async () => {
  try {
    const foundItems = await FoundItemRepository.getFoundItems();
    return foundItems;
  } catch (error) {
    console.log(error);
  }
};

//view individual found item details from all posts
export const getFoundItem = async (id: String) => {
  try {
    const userRequests = await FoundItemRepository.getFoundItem(id);
    return userRequests;
  } catch (e) {
    console.log(e);
  }
};

//get found items posted by logged in user 
export const getFoundItemsByUser = async (userId: string) => {
  try {
    const foundItems = await FoundItemRepository.getFoundItemsByUser(userId);
    return foundItems;
  } catch (error) {
    console.log(error);
  }
};

// delete a specific found item
export const deleteFoundItem = async (foundItemId: string) => {
  try {
      return FoundItemRepository.deleteFoundItem(foundItemId);
  } catch (error) {
      throw error;
  }
};

// edit a specific found item
export const editFoundItem = async (foundItemId: string, updatedData: any) => {
  try {
      return FoundItemRepository.editFoundItem(foundItemId, updatedData);
  } catch (error) {
      throw error;
  }
};

// update status of a found item 
export const updateStatus = async (foundItemId: string, status: string) => {
  try {
    const updatedFoundItem = await FoundItemRepository.updateStatus(foundItemId, status);
    return updatedFoundItem;
  } catch (error) {
    console.log(error);
  }
};

