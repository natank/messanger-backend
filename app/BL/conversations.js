import * as Conversation from '../models/Conversation';
import io from '../socket';

export async function findConversations(req, res, next) {
	var { userId, filter } = req.query;
	try {
		var conversations = await Conversation.findConversations({ userId });
		res.status(200).json({ conversations });
	} catch (err) {
		console.log(err);
		req.flash('error', `can't load conversations`);
		res.status(500).end();
	}
}

export async function getConversation(req, res, next) {
	try {
		const conversationId = req.params.id;
		var conversation = conversationId
			? await Conversation.getConversation({ conversationId })
			: undefined;
		res.status(200).json({ conversation });
	} catch (err) {
		res.status(404).end();
		throw err;
	}
}

export async function postCreateConversation(req, res) {
	var { members, name } = req.body;
	console.log(members);

	try {
		var result = await Conversation.createConversation({
			members,
			name,
		});
	} catch (err) {
		console.log(err);
		res.status(500).end();
	}

	var { members, name, _id } = result;
	var conversation = { members, name, _id };
	res.status(201).json(conversation);
}

export async function postCreateMessage(req, res) {
	const { text, author, conversationId } = req.body;
	const theMessage = { text, author, conversationId };
	try {
		await Conversation.createMessage({
			text: theMessage.text,
			authorId: theMessage.author.id,
			conversationId: theMessage.conversationId,
		});
		io.getIO().emit('message', {
			action: 'create',
			message: theMessage,
		});
		res.status(200).end();
	} catch (err) {
		console.log(err);
		res.status(500).end();
	}
}
