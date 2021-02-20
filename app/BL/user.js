import * as User from '../models/User';

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
	next(error);
}

function generateError() {
	throw new Error('Test error');
}

export async function getConversations(req, res, next) {
	const { userId } = req.query;
	try {
		if (!userId) throw 'user is not defined';
		var conversations = await User.getConversations(userId);
	} catch (error) {
		console.log(error);
		res.status(500).end();
	}
	res.json(conversations);
}
