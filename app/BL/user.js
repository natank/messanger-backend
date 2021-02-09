import * as User from '../models/User';
import { params, validationResult } from 'express-validator';

import bcrypt from 'bcryptjs';

var customError = 'An error occured please try again later';

export async function findUser(id) {
	var user = await User.findById(id);
	return user;
}

export async function getUsers(req, res, next) {
	console.log('get users');
	try {
		var users = await User.getUsers();
		if (!users) users = [];
		users = users.map(user => {
			let { id, username, gender, status } = user;
			return { id, username, gender, status };
		});
	} catch (error) {
		handleError(req, error);
		return res.redirect('/');
	}

	res.status(200).json({ users });
}

function handleError(req, res, next, error) {
	error.statusCode = error.statusCode || 500;
	next(error);
}

function generateError() {
	throw new Error('Test error');
}
