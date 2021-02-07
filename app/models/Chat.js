import mongoose from 'mongoose';
import { UserSchema } from './User';
import { MessageSchema } from './Message';

const chatSchema = new mongoose.Schema({
	members: {
		type: [UserSchema],
		default: [],
	},
	name: {
		type: String,
	},
	dateUpdated: {
		type: Date,
		default: new Date(Date.now())
			.toLocaleString('en-GB', { timeZone: 'UTC' })
			.split(',')[0],
	},
	messages: {
		type: [MessageSchema],
	},
});

export default mongoose.model('chat', chatSchema);
