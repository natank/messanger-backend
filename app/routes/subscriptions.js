import express from 'express';

import * as subscriptionsController from '../BL/subscriptions';

const router = express.Router();

/**
 * Body - {memberId, movieId, date}
 */
router.post('/', subscriptionsController.createSubscription);

/** 
only member Id - Return member movies {memberId, [{movie name, movie id, subscription date}]}
only movie id - Return movie subscription {movieId, [member name, member id]}
Both member and movie - Return member {memberId, {movie name, movie id, subscription date}}
*/
router.get('/', subscriptionsController.findLatestSubscriptions);
/**
 * query: memberId, movieId;
 */

router.put('/', subscriptionsController.updateSubscription);

export default router;
