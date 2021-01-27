import subscriptionsApi from '../API/subscriptions';

export async function findMovies(
	props = { name: undefined, genres: undefined }
) {
	var { name, genres } = props;
	var response = await subscriptionsApi.get('/movies', {
		data: {
			name,
			genres,
		},
	});
	return response.data;
}

export async function findById(movieId) {
	var response = await subscriptionsApi.get(`/movies/${movieId}`);
	return response.data;
}

export async function updateMovie({ id, name, genres, image, premiered }) {
	await subscriptionsApi.put('/movies', { id, name, genres, image, premiered });
}

export async function deleteMovie(id) {
	try {
		await subscriptionsApi.delete(`/movies/${id}`);
	} catch (error) {
		console.log(error);
	}
}

export async function createMovie({ name, genres, image, premiered }) {
	try {
		var response = await subscriptionsApi.post('/movies', {
			name,
			genres,
			image,
			premiered,
		});
	} catch (error) {
		console.log(error);
	}
}
