import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
	},
	blockedUsers: {
		type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
		default: [],
	},
	conversations: {
		type: [{ type: Schema.Types.ObjectId, ref: 'Conversation' }],
		default: [],
	},
	gender: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		required: true,
	},
});

export const User = mongoose.model('User', userSchema);

export async function findByUsername(username) {
	try {
		let user = await User.findOne({ username });
		return user;
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function createUser({ username, gender, password, status }) {
	let user = new User({ username, gender, password, status });
	try {
		await user.save();
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getUsers() {
	try {
		let users = await User.find(
			{},
			'username gender status conversations'
		).populate();

		return users;
	} catch (error) {
		throw error;
	}
}

/**
 *
 * findByFirstName
 * used to find user with name that starts with a specified value
 * Argi,emts :
 *    filter  - specifies the value
 *    userId - is the id of the current user who issued the request from
 * the front end
 *
 */
export async function findByFirstName({ userId, filter }) {
	const regexp = new RegExp(`^${filter}`, 'i');
	const users = await User.find({ username: regexp });
	const filteredUsers = users.filter(user => user.id != userId);
	return filteredUsers;
}

export async function getConversations({ userId, filter }) {
	try {
		var data = await User.findOne(
			{ _id: userId },
			'conversations -_id'
		).populate({
			path: 'conversations',
			populate: { path: 'members' },
		});

		var user = JSON.parse(JSON.stringify(data));
	} catch (error) {
		throw error;
	}
	var conversations = filter
		? user.conversations.filter(conversation => {
				if (conversation.name) {
					return conversation.name
						.toLowerCase()
						.startsWith(filter.toLowerCase());
				} else {
					const withUser = conversation.members.find(
						member => member._id != userId
					);
					return withUser.username
						.toLowerCase()
						.startsWith(filter.toLowerCase());
				}
		  })
		: user.conversations;
	return conversations;
}

export async function getConversation({ userId, conversationId }) {
	const user = await User.findOne({ _id: userId }, 'conversations').populate({
		path: 'conversations',
		match: { _id: { $eq: conversationId } },
	});
	let conversation = await user.conversations[0]
		.populate({ path: 'messages.writtenBy' })
		.populate({ path: 'members' })
		.execPopulate();
	return conversation;
}
