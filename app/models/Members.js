import subscriptionsApi from '../API/subscriptions';

export async function getMembers() {
	var response;
	try {
		response = await subscriptionsApi.get('/members');
	} catch (error) {
		console.log(error);
	}

	return response.data;
}

export async function getMember(id) {
	var response = await subscriptionsApi.get(`/members/${id}`);
	try {
		var member = response.data;
		return member;
	} catch (err) {
		console.log('update failed');
		throw err;
	}
}

export async function updateMember({ id, name, email, city }) {
	try {
		var response = await subscriptionsApi.put(`members/`, {
			_id: id,
			name,
			email,
			city,
		});
		return response.data;
	} catch (err) {
		console.log('err');
		throw err;
	}
}

export async function deleteMember(id) {
	try {
		await subscriptionsApi.delete(`/members/${id}`);
	} catch (err) {
		throw err;
	}
}

export async function createMember({ name, email, city }) {
	try {
		var response = await subscriptionsApi.post('members', {
			name,
			email,
			city,
		});
		return response.data;
	} catch (error) {
		throw err;
	}
}
