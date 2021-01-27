import * as usersDal from '../DAL/userPermissions';

export async function createUser(settings) {
	var users;
	try {
		users = await usersDal.getUsers();
		if (!users) users = [];
	} catch (error) {
		users = [];
	}

	var { userId, permissions } = settings;
	users.push({ userId, permissions });
	await usersDal.writeUsers(users);
}

export async function findById(userId) {
	var users = await usersDal.getUsers();
	var user = users.find(user => user.userId == userId);
	return user ? user.permissions : undefined;
}

export async function updateUser(userId, newPermissions) {
	var users = await usersDal.getUsers();
	var user = users.find(user => user.userId == userId);
	user.permissions = newPermissions;
	await usersDal.writeUsers(users);
}

export async function deleteUser(id) {
	var users = await usersDal.getUsers();
	users = users.filter(user => user.userId != id);

	await usersDal.writeUsers(users);
}
