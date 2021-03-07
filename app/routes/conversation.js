import express from 'express';

import * as conversationsController from '../BL/conversations';
import { isAuth } from '../BL/middleware/auth';

const router = express.Router();

router.get('/list', isAuth, conversationsController.findConversations);

router.post('/', isAuth, conversationsController.postCreateConversation);
router.post('/:id/createMessage', conversationsController.postCreateMessage);
export default router;
