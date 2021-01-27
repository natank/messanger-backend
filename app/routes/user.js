import express from 'express';
import * as userController from '../BL/user';
import {
	checkAccountPassword,
	checkAccountUsername,
} from '../BL/middleware/user';

const router = express.Router();

router.get('/', userController.getUsers);
router.get('/create', userController.getCreateUser);
router.get('/activate', userController.getActivateUser);
router.get('/:id', userController.getUpdateUser);
router.delete('/:id', userController.deleteUser);

router.post('/', userController.postCreateUser);
router.put(
	'/activate',
	checkAccountUsername,
	checkAccountPassword,
	userController.putActivateAccount
);
router.put('/:id', userController.postUpdateUser);

module.exports = router;
