import mongoose from 'mongoose';

const URI = process.env.DB_URI;

export default async function connectDB() {
	try {
		await mongoose.connect(URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('db connected...!');
	} catch (err) {
		throw err;
	}
}
