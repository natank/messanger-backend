import express from 'express';

import * as chatsController from '../BL/chats';
import { isAuth } from '../BL/middleware/auth';

const router = express.Router();

router.get('/', isAuth, chatsController.findChats);
router.get('/:id', isAuth, chatsController.getChat);

router.post('/', isAuth, chatsController.postCreateChat);
router.put('/:id', isAuth, chatsController.updateChat);

export default router;
