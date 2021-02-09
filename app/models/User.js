import mongoose from 'mongoose';
import { MessageSchema } from './Message';
export const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
	},
	blockedUsers: {
		type: [mongoose.ObjectId],
	},
	messages: {
		type: [MessageSchema],
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
		let users = await User.find({}, 'username gender status');

		return users;
	} catch (error) {
		throw error;
	}
}
