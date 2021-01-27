import fs from 'fs';

var fileName = 'userPermissions.json';

export async function getUsers() {
	var users = await readFromFile();
	users = users ? users : [];
	return users;
}

export async function writeUsers(usersData) {
	await fs.writeFile(fileName, JSON.stringify(usersData), () => {
		return;
	});
}

function readFromFile() {
	var p = new Promise((resolve, reject) => {
		fs.readFile(fileName, (err, data) => {
			if (err) {
				console.log(`the error: ${err}`);
				resolve(undefined);
			} else {
				try {
					var userData = JSON.parse(data);
					resolve(userData);
				} catch (err) {
					console.log(err);
				}
			}
		});
	});
	return p;
}
