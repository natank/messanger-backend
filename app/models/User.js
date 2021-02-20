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

export const User = mongoose.model('user', userSchema);

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

export async function getConversations(userId) {
	try {
		var data = await User.findById(userId, 'conversations -_id').populate(
			'conversations'
		);
		var conversations = JSON.parse(JSON.stringify(data));
	} catch (error) {
		throw error;
	}
	return conversations;
}
