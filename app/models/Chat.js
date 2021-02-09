import mongoose from 'mongoose';
import { MessageSchema } from './Message';

function today() {
	let today = new Date(Date.now())
		.toLocaleString('en-GB', { timeZone: 'UTC' })
		.split(',')[0];
	console.log(today);
	return today;
}

const chatSchema = new mongoose.Schema({
	members: {
		type: [mongoose.ObjectId],
		default: [],
	},
	name: {
		type: String,
	},
	dateUpdated: {
		type: Date,
		default: today(),
	},
	messages: {
		type: [MessageSchema],
	},
});

export const Chat = mongoose.model('chat', chatSchema);

export async function createChat({ members, name }) {
	var chat = new Chat({ members, name });
	try {
		chat = await chat.save();
	} catch (error) {
		throw error;
	}
	return { id: chat.id, members: chat.members, name: chat.name };
}
