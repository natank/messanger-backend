import * as Movie from '../models/Movies';

export async function findMovies(req, res, next) {
	var { name, genres } = req.query;
	try {
		var movies = await Movie.findMovies({ name, genres });
		res.status(200).json({ movies });
	} catch (err) {
		console.log(err);
		req.flash('error', `can't load movies`);
		res.status(500).end();
	}
}

export async function getMovie(req, res, next) {
	try {
		const movieId = req.params.id;
		var movie = movieId ? await Movie.findById(movieId) : undefined;
		res.status(200).json({ movie });
	} catch (err) {
		res.status(404).end();
		throw err;
	}
}

export async function postCreateMovie(req, res, next) {
	const { name, genres, image, premiered } = req.body;

	try {
		var movie = await Movie.createMovie({
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

export async function deleteMovie(req, res, next) {
	var { id } = req.params;
	try {
		await Movie.deleteMovie(id);
		res.status(200).end();
	} catch (err) {
		console.log(err);
		res.status(500).end();
	}
}

export async function updateMovie(req, res, next) {
	var { name, genres, image, premiered } = req.body;
	var { id } = req.params;
	try {
		var movie = await Movie.updateMovie({
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
