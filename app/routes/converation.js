import express from 'express';

import * as converrsationsController from '../BL/conversations';
import { isAuth } from '../BL/middleware/auth';

const router = express.Router();

router.get('/list', isAuth, converrsationsController.findConversations);
router.get('/:id', isAuth, converrsationsController.getConversation);

router.post('/', isAuth, converrsationsController.postCreateConversation);

export default router;
