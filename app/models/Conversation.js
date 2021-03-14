import mongoose from 'mongoose';
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
		type: [
			{
				writtenBy: {
					type: Schema.Types.ObjectId,
					ref: 'User',
				},
				text: String,
				dateCreated: Schema.Types.Date,
			},
		],
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

export async function getConversation({ conversationId }) {
	try {
		let conversation = await Conversation.findById(conversationId).populate({
			path: 'messages.writtenBy',
			select: { _id: 1, username: 1 },
		});
		return conversation;
	} catch (error) {
		throw error;
	}
}

export async function createMessage({
	conversationId,
	authorId,
	withUserId,
	message,
}) {
	async function addMessageToConversation({
		conversationId,
		message,
		authorId,
	}) {
		try {
			const conversation = await Conversation.findById(conversationId);
			const messageObj = {
				writtenBy: authorId,
				text: message,
				dateCreated: Date.now(),
			};
			conversation.messages = [...conversation.messages, messageObj];
			await conversation.save();
		} catch (error) {
			throw error;
		}
	}
	if (conversationId) {
		await addMessageToConversation({ conversationId, message, authorId });
	} else if (withUserId) {
		// create new conversation
		try {
			const conversation = await createConversation({
				members: [authorId, withUserId],
			});
			await addMessageToConversation({
				conversationId: conversation.id,
				message,
				authorId,
			});
		} catch (error) {
			throw error;
		}
	} else throw 'illegal message request';
}
