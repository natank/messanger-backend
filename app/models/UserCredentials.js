import mongoose from 'mongoose';

const user = new mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
	},
});

export default mongoose.model('user', user);
