import { Router } from 'express';

import * as FoundItemController from './Controller';
import { upload } from '../LostItems/Middleware';
import { authenticate } from '../User/Middleware';

const router = Router();

const routes = () => {
    //add a new found item
    router.post('/found-items', authenticate, upload.array('images'), FoundItemController.addFoundItem);
    //get found items posted by logged in user 
    router.get('/found-items/user', authenticate, FoundItemController.getFoundItemsByUser);
    //view individual found item details from all posts
    router.get('/found-items/:foundItemId', authenticate, FoundItemController.getFoundItem);
    //view all found items and details from all posts
    router.get('/found-items', authenticate, FoundItemController.getFoundItems);
    // delete a specific found item
    router.delete('/found-items/:foundItemId', authenticate, FoundItemController.deleteFoundItem);
    // edit a specific found item
    router.put('/found-items/:foundItemId', authenticate, upload.array('images'), FoundItemController.editFoundItem);
     // update found item status
     router.patch('/found-items/:foundItemId', authenticate, FoundItemController.updateStatus);

    return router;
};

export default routes;