import { updateUser } from '../../models/User';

export default async function hasTransactions(req, res, next) {
	var user = req.user;
	if (!user.transactionsCounter) user.transactionsCounter = 0;
	if (user.transactionsCounter < user.transactions) {
		user.transactionsCounter++;
		await updateUser(user);
		next();
	} else {
		req.flash('error', `Your have exceeded your daily transactions`);
		res.redirect('/');
	}
}
