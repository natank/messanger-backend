import { render } from 'pug';
import * as Member from '../models/Members';
import * as Movie from '../models/Movies';

export async function getMembers(req, res, next) {
	try {
		var members = await Member.getMembers();
		var movies = await Movie.findMovies();
		res.json({ members, movies });
	} catch (err) {
		res.status(500).end();
		throw err;
	}
}

export async function getMember(req, res, next) {
	try {
		const memberId = req.params.id;
		var member = undefined;
		if (memberId) {
			try {
				member = await Member.getMember(memberId);
			} catch (error) {
				if (error) console.log(error);
			}
		}
		res.json({ member });
	} catch (err) {
		next(err);
		throw err;
	}
}

export async function postCreateMember(req, res, next) {
	const { name, email, city } = req.body;

	try {
		var member = await Member.createMember({ name, email, city });
		res.status(200).end();
	} catch (err) {
		res.status(500).end();
		console.log(err);
	}
}

export async function getDeleteMember(req, res, next) {
	var { id } = req.params;
	try {
		await Member.deleteMember(id);
		res.status(200).end();
	} catch (err) {
		console.log(err);
		res.status(500).end();
	}
}

export async function postUpdateMember(req, res, next) {
	var { name, email, city } = req.body;
	var { id } = req.params;
	try {
		var member = await Member.updateMember({ id, name, email, city });
		res.status(200).end();
	} catch (err) {
		res.status(500).end();
		console.log(err);
	}
}
