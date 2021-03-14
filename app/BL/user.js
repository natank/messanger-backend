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
		// Find the conversations that match the filters
		const conversations = await User.getConversations({ userId, filter });
		// find the users with private conversations
		const existingPrivateConversations = conversations.filter(
			conversation => !conversation.name
		);

		// Find all the users that match the filter
		const users = await User.findByFirstName({ userId, filter });

		// Find the users that match the filter but don't have private conversations already
		const usersWithNoConversation = users.reduce(
			function findUsersWithNoConversation(acc, user) {
				const userHasPrivateConversation = existingPrivateConversations.some(
					// check if the user is member in one of the private conversations
					function checkIfConversationIncludesUser(privateConversation) {
						// check if the user if member of the current private conversation
						const privateConversationContainsUser = privateConversation.members.some(
							function compareMemberToUser(member) {
								const match = member._id == user.id;
								return match;
							}
						);
						return privateConversationContainsUser;
					}
				);
				{
					// filter userif already included in private conversation
					if (userHasPrivateConversation) return [...acc];
					else return [...acc, user];
				}
			},
			[]
		);
		const potentialPrivateConversations = usersWithNoConversation.map(user => {
			return {
				members: [
					{ username: user.username, gender: user.gender, _id: user.id },
					userId,
				],
				messages: [],
			};
		});
		res.json([...conversations, ...potentialPrivateConversations]);
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
