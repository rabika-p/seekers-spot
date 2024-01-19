import { Router } from 'express';

import * as UserController from './Controller';
import * as UserMiddleware from './Middleware';

const router = Router();

const routes = () => {

    //Routes for user onboarding process
    router.post('/signup', UserController.createAuthenticatedUser);
    router.post('/login', UserController.login);
    // router.post('/auth', UserMiddleware.authenticate);
    router.post('/forgot-password', UserController.forgotPsw);
    router.post('/reset-password', UserMiddleware.authenticate, UserController.resetPsw);

  
    return router;

};

export default routes;