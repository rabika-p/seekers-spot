import { Router } from 'express';

import * as MatchController from './Controller';
import { authenticate } from '../User/Middleware';

const router = Router();

const routes = () => {
    // add a new match
    router.post('/matches', authenticate, MatchController.addMatch);
    // get match requests of a logged-in user for their lost/found items
    router.get('/matches/user', authenticate, MatchController.getMatchesByUser);
    // get match requests for an item
    router.get('/matches', authenticate, MatchController.getMatches);
    // delete a match
    router.delete('/matches/:matchId', authenticate, MatchController.deleteMatch)
    // update match status
    router.patch('/matches/:matchId', authenticate, MatchController.updateStatus);

    return router;
};

export default routes;