import fs from 'fs';

var fileName = 'usersData.json';

export async function getUsers() {
	var allUsers = await readUsersFromFile();
	return allUsers;
}

export async function writeUsers(usersData) {
	await fs.writeFile(fileName, JSON.stringify(usersData), () => {
		return;
	});
}

function readUsersFromFile() {
	var p = new Promise((resolve, reject) => {
		fs.readFile(fileName, (err, data) => {
			if (err) {
				console.log(`the error: ${err}`);
				resolve(undefined);
			} else {
				try {
					var usersData = JSON.parse(data);
					resolve(usersData);
				} catch (err) {
					console.log(err);
				}
			}
		});
	});
	return p;
}
