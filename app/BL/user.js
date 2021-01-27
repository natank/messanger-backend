import * as User from '../models/User';
import { params, validationResult } from 'express-validator';

import bcrypt from 'bcryptjs';

var customError = 'An error occured please try again later';

export async function findUser(id) {
	var user = await User.findById(id);
	return user;
}

export async function getUsers(req, res, next) {
	try {
		var users = await User.getUsers();
		if (!users) users = [];
		users.forEach(permissionsToString);
	} catch (error) {
		handleError(req, error);
		return res.redirect('/');
	}

	res.status(200).json({ users });
}

export async function getActivateUser(req, res) {
	try {
		res.status(200).json({
			errorMessage: req.flash('error'),
			oldInput: {
				email: '',
				password: '',
			},
			validationErrors: [],
		});
	} catch (error) {
		handleError(req, customError, error);
		res.status(500).end();
	}
}

export function getCreateUser(req, res) {
	res.status(200).json({ errorMessage: req.flash('error') });
}

export async function getUpdateUser(req, res) {
	try {
		var userId = req.params.id;
		var user = await User.findById(userId);

		if (user) {
			res.status(200).json({ editedUser: user });
		} else {
			req.flash('error', 'user not found');
			res.status(404).end();
		}
	} catch (error) {
		console.log(error.message);
		req.flash('error', 'Something went wrong');
		handleError(req, customError, error.message);
		res.status(500).end();
	}
}

export async function deleteUser(req, res) {
	try {
		var { id } = req.params;
		req.user = { id: 1 };
		//Prevent deleting the current user
		if (req.user && req.user.id != id) {
			try {
				await User.deleteUser(id);
				res.status(200).end();
			} catch (err) {
				res.status(500).end();
				throw err;
			}
		} else {
			res.status(204).end();
		}
	} catch (error) {
		handleError(req, customError, error.message);
		res.status(500).end();
	}
}

export async function postCreateUser(req, res, next) {
	try {
		var keys = [
			'username',
			'firstName',
			'lastName',
			'sessionTimeOut',
			'permissions',
			'isAdmin',
		];
		var userSettings = {};
		keys.forEach(key => (userSettings[key] = req.body[key]));

		await User.createUser(userSettings);

		res.status(200).json({ message: 'User created' });
	} catch (error) {
		handleError(req, res, next, error);
	}
}

export async function postUpdateUser(req, res, next) {
	try {
		var { id } = req.params;
		var {
			username,
			firstName,
			lastName,
			sessionTimeOut,
			permissions,
		} = req.body;

		try {
			await User.updateUser({
				id,
				firstName,
				lastName,
				sessionTimeOut,
				permissions,
			});
		} catch (err) {
			throw err;
		}
		res.status(200).end();
	} catch (error) {
		handleError(req, error);
		res.status(500).end();
	}
}

export async function putActivateAccount(req, res, next) {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const error = new Error('Validation failed.');
			error.statusCode = 422;
			error.data = errors.array();
			throw error;
		} else {
			var { username, password } = req.body;
			// console.log(`password entered: ${password}`)
			let hashedPassword = await bcrypt.hash(password, 12);
			var userId = req.userToActivate.id;
			await User.updateUserPassword(userId, hashedPassword);
			res.status(200).json({ message: 'User activated', userId });
		}
	} catch (error) {
		handleError(req, error);
		res.status(500).end();
	}
}

function permissionsToString(user) {
	var permissions = [];
	for (const [key, value] of Object.entries(user.permissions.movies)) {
		switch (key) {
			case 'view':
				if (value == true) permissions.push('View Movies');
				break;
			case 'create':
				if (value == true) permissions.push('Create Movies');
				break;
			case 'delete':
				if (value == true) permissions.push('Delete Movies');
				break;
			case 'update':
				if (value == true) permissions.push('Update Movies');
				break;
			default:
				break;
		}
	}
	for (const [key, value] of Object.entries(user.permissions.subscriptions)) {
		switch (key) {
			case 'view':
				if (value == true) permissions.push('View Subscriptions');
				break;
			case 'create':
				if (value == true) permissions.push('Create Subscriptions');
				break;
			case 'delete':
				if (value == true) permissions.push('Delete Subscriptions');
				break;
			case 'update':
				if (value == true) permissions.push('Update Subscriptions');
				break;
			default:
				break;
		}
	}
	user.permissions.isAdmin ? permissions.push('Admin') : null;
	user.permissions = permissions;
}

function handleError(req, res, next, error) {
	error.statusCode = error.statusCode || 500;
	next(error);
}

function generateError() {
	throw new Error('Test error');
}
