import * as Subscriptions from '../models/Subscriptions';

var customError = 'An error occured please try again later';
export async function findLatestSubscriptions(req, res, next) {
	var { memberId, movieId } = req.query;
	try {
		var subscriptions = await Subscriptions.getSubscriptions({
			memberId,
			movieId,
		});
		res.status(200).json(subscriptions);
	} catch (err) {
		res.status(500).end(err);
		handleError(req, customError, err);
	}
}

export async function createSubscription(req, res, next) {
	const { memberId, movieId, date } = req.body;

	try {
		var subscription = await Subscriptions.createSubscription({
			memberId,
			movieId,
			date,
		});
		res.status(200).json(subscription);
	} catch (err) {
		res.status(500).end(err);
		handleError(req, customError, err);
	}
}

export async function deleteSubscription(req, res, next) {
	var { id } = req.params;
	try {
		await Subscriptions.deleteMember(id);
		res.status(200).end();
	} catch (err) {
		console.log(err);
		res.status(500).end();
	}
}

export async function updateSubscription(req, res, next) {
	var { name, email, city } = req.body;
	var { id } = req.params;
	console.log(`id = ${id}`);
	try {
		var member = await Subscriptions.updateMember({ id, name, email, city });
		res.status(200).end();
	} catch (err) {
		res.status(500).end();
		console.log(err);
	}
}

function handleError(req, customError, error) {
	console.log(error);
	req.flash('error', customError);
}
