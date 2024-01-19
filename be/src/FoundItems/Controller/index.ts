import { Request, Response } from "express";

import * as FoundItemService from "../Service";

// const handleFileUpload = upload.array('images');

//add a new found item
export const addFoundItem = async (req: Request, res: Response) => {
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
      const result = await FoundItemService.addFoundItem({
        ...req.body,
        images: filenames,
      });
      res.status(201).json(result);
    } else {
      const result = await FoundItemService.addFoundItem({ ...req.body });
      // console.log(result);
      res.status(201).json(result);
    }
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
};

//view all found items and details from all posts
export const getFoundItems = async (req: Request, res: Response) => {
  try {
    const foundItems = await FoundItemService.getFoundItems();
    res.status(200).json(foundItems);
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
};

//view individual found item details from all posts
export const getFoundItem = async (req: Request, res: Response) => {
  try {
    const id = req.params.foundItemId;
    const foundItem = await FoundItemService.getFoundItem(id);
    res.status(200).json(foundItem);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to retrieve requested items" });
  }
};

//get found items posted by logged in user 
export const getFoundItemsByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    const foundItems = await FoundItemService.getFoundItemsByUser(userId);
    res.status(200).json(foundItems);
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
};

// delete a specific found item
export const deleteFoundItem = async (req: Request, res: Response) => {
  try {
      const foundItemId = req.params.foundItemId as string;
      const deletedItem = await FoundItemService.deleteFoundItem(foundItemId);
      res.status(200).json({ message: 'Found item deleted successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while deleting the found item' });
  }
};

// edit a specific found item
export const editFoundItem = async (req: Request, res: Response) => {
  try {
    const { foundItemId } = req.params;
    const updatedData = req.body;
     const images = req.files;

    if (images && images.length > 0) {
      const filenames = images.map((image) => image.filename);
      updatedData.images = filenames;
    }
    const updatedFoundItem = await FoundItemService.editFoundItem(foundItemId, updatedData);

    return res.status(200).json({ message: 'Found item updated successfully', data: updatedFoundItem });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// update status of a found item
export const updateStatus = async (req: Request, res: Response) => {
  try {
    const foundItemId = req.params.foundItemId;
    const status = req.body.status;
    
    const foundItem = await FoundItemService.updateStatus(foundItemId, status);
    console.log(foundItem)
    res.status(200).json(foundItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update found item" });
  }
};