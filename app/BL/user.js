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
	const { userId, filter } = req.query;
	try {
		if (!userId) throw 'user is not defined';
		const conversations = await User.getConversations({ userId, filter });
		const users = await User.findByFirstName({ userId, filter });
		const privateConversations = users.map(user => {
			return { withUser: user };
		});
		console.log(
			`private conversations : ${JSON.stringify(privateConversations)}`
		);
		res.json([...conversations, ...privateConversations]);
	} catch (error) {
		console.log(error);
		res.status(500).end();
	}
}

export async function getConversation(req, res) {
	const { userId } = req.query;
	const { conversationId } = req.params;
	try {
		const conversation = await User.getConversation({ userId, conversationId });
		res.status(200).json(conversation);
	} catch (error) {
		res.status(500).end();
	}
}
