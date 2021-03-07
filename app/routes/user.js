import express from 'express';
import * as userController from '../BL/user';
import { isAuth } from '../BL/middleware/auth';
const router = express.Router();

router.get('/', isAuth, userController.getUsers);
router.get('/conversations', isAuth, userController.getConversations);
router.get(
	'/conversations/:conversationId',
	isAuth,
	userController.getConversation
);
module.exports = router;
