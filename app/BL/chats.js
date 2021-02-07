import * as Chat from '../models/Chat';

export async function findChats(req, res, next) {
	var { name, genres } = req.query;
	try {
		var chats = await Chat.findChats({ name, genres });
		res.status(200).json({ chats });
	} catch (err) {
		console.log(err);
		req.flash('error', `can't load chats`);
		res.status(500).end();
	}
}

export async function getChat(req, res, next) {
	try {
		const chatId = req.params.id;
		var chat = chatId ? await Chat.findById(chatId) : undefined;
		res.status(200).json({ chat });
	} catch (err) {
		res.status(404).end();
		throw err;
	}
}

export async function postCreateChat(req, res, next) {
	const { name, genres, image, premiered } = req.body;

	try {
		var chat = await Chat.createChat({
			name,
			genres,
			image,
			premiered,
		});
		res.status(200).end();
	} catch (err) {
		console.log(err);
		res.staus(500).end();
	}
}

export async function updateChat(req, res, next) {
	var { name, genres, image, premiered } = req.body;
	var { id } = req.params;
	try {
		var chat = await Chat.updateChat({
			id,
			name,
			genres,
			image,
			premiered,
		});
		res.status(200).end();
	} catch (err) {
		res.status(500).end();
		console.log(err);
	}
}
