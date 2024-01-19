import { Request, Response } from "express";

import * as LostItemService from "../Service";
import { upload } from "../Middleware";
import { ObjectId } from "mongodb";
// const handleFileUpload = upload.array('images');

//add a new lost item
export const addLostItem = async (req: Request, res: Response) => {
  // ?.filename;

  // handleFileUpload(req, res, async (err) => {
  //   if (err) {
  //     console.error(err);
  //     return res.status(500).json({ message: 'File upload failed' });
  //   }

  try {
    const images = req.files;

    if (images && images.length > 0) {
      const filenames = images.map((image) => image.filename);
      // console.log(filenames);
      const result = await LostItemService.addLostItem({
        ...req.body,
        images: filenames,
      });
      res.status(201).json(result);
    } else {
      const result = await LostItemService.addLostItem({ ...req.body });
      // console.log(result);
      res.status(201).json(result);
    }
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
};

//view all lost items and details from all posts
export const getLostItems = async (req: Request, res: Response) => {
  try {
    const lostItems = await LostItemService.getLostItems();
    res.status(200).json(lostItems);
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
};

//view individual lost item details from all posts
export const getLostItem = async (req: Request, res: Response) => {
  try {
    const id = req.params.lostItemId;
    const lostItem = await LostItemService.getLostItem(id);
    res.status(200).json(lostItem);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to retrieve requested items" });
  }
};

//get lost items posted by logged in user 
export const getLostItemsByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    const lostItems = await LostItemService.getLostItemsByUser(userId);
    res.status(200).json(lostItems);
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
};

// delete a specific lost item
export const deleteLostItem = async (req: Request, res: Response) => {
  try {
      const lostItemId = req.params.lostItemId as string;
      const deletedItem = await LostItemService.deleteLostItem(lostItemId);
      res.status(200).json({ message: 'Lost item deleted successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while deleting the lost item' });
  }
};

// edit a specific lost item
export const editLostItem = async (req: Request, res: Response) => {
  try {
    const { lostItemId } = req.params;
    const updatedData = req.body;
    const images = req.files;

    if (images && images.length > 0) {
      const filenames = images.map((image) => image.filename);
      updatedData.images = filenames;
    }

    const updatedLostItem = await LostItemService.editLostItem(lostItemId, updatedData);
    return res.status(200).json({ message: 'Lost item updated successfully', data: updatedLostItem });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// update status of a lost item
export const updateStatus = async (req: Request, res: Response) => {
  try {
    const lostItemId = req.params.lostItemId;
    const status = req.body.status;
    
    const lostItem = await LostItemService.updateStatus(lostItemId, status);
    console.log(lostItemId)
    res.status(200).json(lostItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update lost item" });
  }
};