import UserCredentials from './UserCredentials';
import * as UserPermissions from './UserPermissions';
import * as UserData from './UserData';

export async function createUser(settings) {
	var {
		username,
		firstName,
		lastName,
		sessionTimeOut,
		permissions,
		isAdmin,
	} = settings;
	var userPermissions = createUserPermissions([
		...permissions,
		isAdmin ? 'isAdmin' : '',
	]);

	var userCredentials = new UserCredentials({ username });

	try {
		userCredentials = await userCredentials.save();
	} catch (err) {
		console.log(err);
		throw err;
	}

	var userId = userCredentials._id.toString();

	var settings = { userId, permissions: userPermissions };
	await UserPermissions.createUser(settings);

	settings = { userId, firstName, lastName, sessionTimeOut };
	var user = await UserData.createUser(settings);
	return user;
}

export async function updateUser(settings) {
	var { id, firstName, lastName, sessionTimeOut, permissions } = settings;
	var userPermissions = createUserPermissions(permissions);
	await UserPermissions.updateUser(id, userPermissions);
	await UserData.updateUser(id, {
		firstName,
		lastName,
		sessionTimeOut,
	});
}

export async function updateUserPassword(id, password) {
	if (password) {
		try {
			await UserCredentials.findByIdAndUpdate(id, { password });
		} catch (error) {
			throw error;
		}
	}
}

export async function findById(userId) {
	try {
		var credentials = await UserCredentials.findById(userId);
	} catch (error) {
		console.log(error);
		throw error;
	}
	if (!credentials) return null;
	var { _id, username, password } = credentials;
	credentials = { _id: _id.toString(), username, password };
	var permissionsAndData = await getPermissionsAndData(credentials._id);

	var user = { ...credentials, ...permissionsAndData };
	return user;
}

export async function findByUsername(username) {
	var credentials;
	try {
		credentials = await UserCredentials.findOne({ username });
	} catch (error) {
		console.log(error);
		throw error;
	}
	if (!credentials) return null;
	var { _id, username, password } = credentials;

	credentials = { _id: _id.toString(), username, password };
	var permissionsAndData = await getPermissionsAndData(credentials._id);

	var user = { ...credentials, ...permissionsAndData };
	return user;
}

export async function deleteUser(userId) {
	try {
		await UserCredentials.deleteOne({ _id: userId });
		await UserPermissions.deleteUser(userId);
		await UserData.deleteUser(userId);
	} catch (err) {
		console.log(err);
		throw err;
	}
}

export async function getUsers(credentials) {
	var usersCredentials = await UserCredentials.find();
	var usersPermissions = Promise.all(
		usersCredentials.map(user => UserPermissions.findById(user._id))
	);
	var usersData = Promise.all(
		usersCredentials.map(user => UserData.findById(user._id))
	);
	usersPermissions = await usersPermissions;
	usersData = await usersData;
	var users = usersCredentials.map((userCredentials, index) => {
		var userPermissions = usersPermissions[index];
		var userData = usersData[index];
		var { _id, username } = userCredentials;
		var permissions = userPermissions;
		var { firstName, lastName, createdDate, sessionTimeOut } = userData;
		var user = {
			id: _id,
			permissions,
			firstName,
			lastName,
			createdDate,
			sessionTimeOut,
		};
		return user;
	});
	return users;
}

async function getPermissionsAndData(userId) {
	try {
		var permissions = await UserPermissions.findById(userId);
		if (!permissions) return null;
	} catch (error) {
		console.log(error);
	}

	try {
		var data = await UserData.findById(userId);
		if (!data) return null;
	} catch (error) {
		console.log(error);
	}
	var { firstName, lastName, sessionTimeOut, createdDate } = data;
	var user = {
		firstName,
		lastName,
		sessionTimeOut,
		createdDate,
		permissions,
		userId,
	};
	return user;
}

function createUserPermissions(permissions) {
	var defaultPermissions = {
		movies: {
			view: false,
			create: false,
			delete: false,
			update: false,
		},
		subscriptions: {
			view: false,
			create: false,
			delete: false,
			update: false,
		},
		isAdmin: false,
	};
	var userPermissions = { ...defaultPermissions };
	permissions.forEach(permission => {
		switch (permission) {
			case 'viewMovies':
				userPermissions['movies']['view'] = true;
				break;
			case 'createMovies':
				userPermissions['movies']['create'] = true;
				break;
			case 'deleteMovies':
				userPermissions['movies']['delete'] = true;
				break;
			case 'updateMovies':
				userPermissions['movies']['update'] = true;
				break;
			case 'viewSubscriptions':
				userPermissions['subscriptions']['view'] = true;
				break;
			case 'createSubscriptions':
				userPermissions['subscriptions']['create'] = true;
				break;
			case 'deleteSubscriptions':
				userPermissions['subscriptions']['delete'] = true;
				break;
			case 'updateSubscriptions':
				userPermissions['subscriptions']['update'] = true;
				break;
			case 'isAdmin':
				userPermissions['isAdmin'] = true;
			default:
				break;
		}
	});
	return userPermissions;
}
