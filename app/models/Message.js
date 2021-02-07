import mongoose from 'mongoose';

export const messageSchema = new mongoose.Schema({
	text: String,
	date: {
		type: Date,
		default: Date(Date.now())
			.toLocaleString('en-GB', { timeZone: 'UTC' })
			.split(',')[0],
	},
	writtenBy: mongoose.ObjectId,
});
