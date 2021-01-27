function setUserType(req, res) {
	if (req.user) res.locals.userType = req.user.admin ? 'admin' : 'user';
	else res.locals.userType = 'guest';
}
export const adminData = function (req, res, next) {
	setUserType(req, res);
	res.locals.section = 'admin';
	next();
};

export const shopData = function (req, res, next) {
	setUserType(req, res);
	next();
};

export default function setLocals(req, res, next) {
	if (req.user) {
		var {
			username,
			userId,
			createdDate,
			firstName,
			lastName,
			permissions,
		} = req.user;
		var user = {
			username,
			userId,
			createdDate,
			firstName,
			lastName,
			permissions,
		};
		res.locals.authUser = user;
	}

	next();
}
