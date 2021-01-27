import { check, body } from 'express-validator/check';
import { validationResult } from 'express-validator/check';
import * as User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function getLogin(req, res, next) {
	res.json({
		errorMessage: req.flash('error'),
		oldInput: {
			email: '',
			password: '',
		},
		validationErrors: [],
	});
}

export async function postLogin(req, res, next) {
	const errors = validationResult(req);
	const { username, password } = req.body;

	if (errors.isEmpty()) signInUser();
	else cancelSignIn();

	// logInUser()

	function signInUser() {
		var loadedUser = req.user;
		const userId = loadedUser._id.toString();
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
		res.status(200).json({
			errorMessage: errors.array()[0].msg,
			oldInput: {
				username,
				password,
			},
			validationErrors: errors.array(),
		});
	}
}

exports.getLogout = async (req, res, next) => {
	try {
		await req.session.destroy();
		res.status(200).end();
	} catch (err) {
		const error = new Error(err);
		error.httpStatusCode = 500;
		return next(error);
	}
};
export async function getSignup(req, res, next) {}

export async function postCreateUser__Deprecated(req, res, next) {
	var { username, transactions, password } = req.body;
	let hashedPassword = await bcrypt.hash(password, 12);
	await User.createUser({ username, transactions, password: hashedPassword });
	res.status(200).end();
}

export async function postUpdateUser__Deprecated(req, res, next) {
	var users = await User.getUsers();
	var { id } = req.params;
	var { username, password, transactions } = req.body;

	var user = users.find(user => user.id == id);

	user = { ...user, username, password, transactions };

	await User.updateUser(user);

	res.status(200).end();
}

export var validateUsername = body('username') //validate username
	.custom(async (value, { req }) => {
		let { username } = req.body;
		let user;
		try {
			user = await User.findByUsername(username);
		} catch (error) {
			console.log(error);
			throw error;
		}

		if (!user) {
			const error = new Error('Incorrect username');
			error.statusCode = 401;
			console.log(error);
			throw error;
		} else {
			req.user = user;
			return true;
		}
	})
	.withMessage('Username does not exist!!');

export var validatePassword = body('password', 'password error') // validate password
	.isLength({
		min: 5,
	})
	.withMessage('password must be 5 chars or more')
	.isAlphanumeric()
	.withMessage('password must contain only letters and numbers')
	.trim()
	.custom(async (value, { req }) => {
		let { password } = req.body;
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
	});
