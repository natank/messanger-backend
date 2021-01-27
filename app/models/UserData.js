import * as usersDal from '../DAL/userData';

export async function createUser(settings) {
	var users;
	try {
		users = await usersDal.getUsers();
		if(!users) users=[];
	} catch (error) {
		users = [];
	}
	var createdDate = new Date(Date.now())
	var mm = createdDate.getMonth() + 1;
	var dd = createdDate.getDate();
	var yy = createdDate.getFullYear();
	createdDate = `${yy}-${mm}-${dd}`
	


	var user = { ...settings, createdDate };
	users.push(user);
	await usersDal.writeUsers(users);
}

export async function getUsers() {
	var users = await usersDal.getUsers();

	return users ? users : null;
}

export async function findById(id) {
	var users = await getUsers();
	var user = users.find(user => user.userId == id);
	return user;
}

export async function updateUser(userId, newData) {
	var users = await usersDal.getUsers();

	var user = users.find(currUser => currUser.userId == userId);
	Object.keys(newData).forEach(key => {
		user[key] = newData[key];
	});

	await usersDal.writeUsers(users);
}

export async function deleteUser(id) {
	var users = await usersDal.getUsers();
	users = users.filter(currUser => {
		var result = currUser.userId != id;
		return result;
	});
	await usersDal.writeUsers(users);
}
