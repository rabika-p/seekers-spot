import { Router } from 'express';

import * as LostItemController from './Controller';
import { upload } from './Middleware';
import { authenticate } from '../User/Middleware';

const router = Router();

const routes = () => {
    //add a new lost item, 'images' parameter (expect an array of files called images) 
    router.post('/lost-items', authenticate, upload.array('images'), LostItemController.addLostItem);
    //get lost items posted by logged in user 
    router.get('/lost-items/user', authenticate, LostItemController.getLostItemsByUser);
    //view individual lost item details from all posts
    router.get('/lost-items/:lostItemId', authenticate, LostItemController.getLostItem);
    //view all lost items and details from all posts
    router.get('/lost-items', authenticate, LostItemController.getLostItems);
    // delete a specific lost item
    router.delete('/lost-items/:lostItemId', authenticate, LostItemController.deleteLostItem);
    // edit a specific lost item
    router.put('/lost-items/:lostItemId', authenticate, upload.array('images'), LostItemController.editLostItem);
    // update lost item status
    router.patch('/lost-items/:lostItemId', authenticate, LostItemController.updateStatus);


    return router;
};

export default routes;