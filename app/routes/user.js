import express from 'express';
import * as userController from '../BL/user';
import {
	checkAccountPassword,
	checkAccountUsername,
} from '../BL/middleware/user';

const router = express.Router();

router.get('/', userController.getUsers);

module.exports = router;
