import * as User from '../../models/User';
import { check, body, param, validationResult } from 'express-validator';

var user;

export var checkAccountUsername = body('username')
	//check if username field was entered
	.not()
	.isEmpty()
	.withMessage('username must be entered')
	// check if account exist
	.custom(async function (username, { req }) {
		try {
			if (username) user = await User.findByUsername(username);
		} catch (error) {
			console.log(error);
		}
		if (!user) return Promise.reject("The account doesn't exist");
		else {
			req.userToActivate = { id: user._id.toString() };
		}
	})
	// check if account is free
	.custom(async function (username, { req }) {
		if (user && user.password) return Promise.reject('Account already taken');
	});

export var checkAccountPassword = body('password')
	.not()
	.isEmpty()
	.withMessage('please provide a password');
