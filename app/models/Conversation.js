import mongoose from 'mongoose';
import { MessageSchema } from './Message';
import { User } from './User';
const Schema = mongoose.Schema;

function today() {
	let today = new Date(Date.now());
	return today;
}

const conversationSchema = new Schema({
	members: {
		type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
		default: [],
	},
	name: {
		type: String,
	},
	dateUpdated: {
		type: String,
		default: today(),
	},
	messages: {
		type: [MessageSchema],
		default: [],
	},
});

export const Conversation = mongoose.model('Conversation', conversationSchema);

export async function createConversation({ members, name }) {
	try {
		var conversation = new Conversation({ members, name });
	} catch (error) {
		console.log(error);
	}
	try {
		conversation = await conversation.save();
	} catch (error) {
		throw error;
	}
	try {
		var users = await User.find({
			_id: { $in: members.map(member => mongoose.Types.ObjectId(member)) },
		});
	} catch (error) {
		throw error;
	}

	users = users.map(user => {
		const conversations = [...user.conversations, conversation];
		user.conversations = conversations;
		return user.save();
	});
	try {
		users = await Promise.all(users);
	} catch (error) {
		throw error;
	}

	return {
		id: conversation.id,
		members: conversation.members,
		name: conversation.name,
	};
}

/**getConversations
 * get all the conversations that user participated in.
 */
export async function getConversations(userId) {}

export async function getConversation({conversationId}) {
	try {
		let conversation = await Conversation.findById(conversationId)
		console.log(conversation)
		return conversation
	} catch (error) {
		throw error
	}
}
