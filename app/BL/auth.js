import { check, body } from 'express-validator/check';
import { validationResult } from 'express-validator/check';
import * as User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function postLogin(req, res, next) {
	const errors = validationResult(req);
	const { username, password } = req.body;

	if (errors.isEmpty()) signInUser();
	else cancelSignIn();

	// logInUser()

	function signInUser() {
		var loadedUser = req.user;
		const userId = loadedUser.id.toString();
		var token = jwt.sign(
			{
				username: loadedUser.username,
				userId,
			},
			'parserdepracated',
			{ expiresIn: '1h' }
		);

		res.status(200).json({ token, userId, user: { ...loadedUser } });
	}

	function cancelSignIn() {
		res.status(400).json({
			errorMessage: errors.array(), //[0].msg,
			oldInput: {
				username,
				password,
			},
			validationErrors: errors.array(),
		});
	}
}

export async function postCreateUser(req, res, next) {
	const errors = validationResult(req);
	if (errors.isEmpty()) {
		var { username, password, gender, status } = req.body;
		let hashedPassword = await bcrypt.hash(password, 12);
		await User.createUser({
			username,
			gender,
			password: hashedPassword,
			status,
		});
		res.status(200).end();
	} else {
		res.json({ errors });
	}
}

/**Middleware functions */
export var validateLoginUsername = body('username').custom(
	async (username, { req }) => {
		try {
			var user = await User.findByUsername(username);
		} catch (error) {
			console.log(error);
		}
		if (!user) {
			var error = new Error('user not found');
			error.statusCode = 401;
			throw error;
		} else {
			req.user = user;
			return true;
		}
	}
);
export var validateLoginPassword = body('password').custom(
	async (password, { req }) => {
		if (req.user) {
			try {
				var doMatch = await bcrypt.compare(password, req.user.password);
			} catch (error) {
				console.log(error);
			}

			if (doMatch) return true;
			else {
				var error = new Error('Incorrect password');
				error.statusCode = 401;
				console.log(error);
				throw error;
			}
		}
	}
);

export var validateSignupUsername = body('username') //validate username
	.isAlphanumeric()
	.not()
	.isEmpty()
	.custom(async username => {
		let user;
		try {
			user = await User.findByUsername(username);
		} catch (error) {
			console.log(error);
			throw error;
		}

		if (user) {
			const error = new Error('Username already exist');
			error.statusCode = 401;
			console.log(error);
			throw error;
		}
	});

export var validateSignupPassword = body('password') // validate password
	.custom((password, { req }) => {
		if (password !== req.body.passwordConfirmation) {
			throw new Error('Password confirmation not match password');
		}
		return true;
	})
	.isLength({
		min: 5,
	})
	.withMessage('password must be 5 chars or more')
	.isAlphanumeric()
	.withMessage('password must contain only letters and numbers');

export const signupMiddleware = [
	validateSignupUsername,
	validateSignupPassword,
];
