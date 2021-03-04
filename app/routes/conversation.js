import express from 'express';

import * as conversationsController from '../BL/conversations';
import { isAuth } from '../BL/middleware/auth';

const router = express.Router();

router.get('/list', isAuth, conversationsController.findConversations);
router.get('/:id', isAuth, conversationsController.getConversation);

router.post('/', isAuth, conversationsController.postCreateConversation);

export default router;
