const jwt = require('jsonwebtoken');

/**Middleware */
export function isAuth(req, res, next) {
	const authHeader = req.get('Authorization');
	if (!authHeader) {
		const error = new Error('Not authenticated');
		error.statusCode = 401;
		console.log('not authorized request');
		return next(error);
	}
	const token = authHeader.split(' ')[1];
	try {
		var decodedToken = jwt.verify(token, 'parserdepracated');
	} catch (error) {
		error.statusCode = 500;
		throw error;
	}
	if (!decodedToken) {
		const error = new Error('Not authenticated.');
		error.statusCode = 401;
		throw error;
	}
	req.userId = decodedToken.userId;
	next();
}
