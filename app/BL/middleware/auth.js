const jwt = require('jsonwebtoken');

export const isLoggedIn = (req, res, next) => {
	if (req.session.user) {
		next();
	} else {
		req.flash('error', 'You must be logged in to access this page');
		return res.redirect('/login');
	}
};

export const isAdmin = (req, res, next) => {
	if (req.session.user && req.session.user.isAdmin) {
		next();
	} else {
		req.flash('error', 'You must be logged as admin to access this page');
		return res.redirect('/login');
	}
};

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

function checkPermissionsToRoute(user, currRoute) {
	if (user.permissions.isAdmin) return true;
	var requiredPermissions = [
		// Movie permissions
		{
			url: /^\/movies$/,
			method: 'GET',
			permission: {
				movies: 'view',
			},
		},
		{
			url: /^\/movies\/delete/,
			method: 'GET',
			permission: {
				movies: 'delete',
			},
		},
		{
			url: /^\/movies\/create/,
			method: 'GET',
			permission: {
				movies: 'create',
			},
		},
		{
			url: /^\/movies\/.*/,
			method: 'GET',
			permission: {
				movies: 'update',
			},
		},
		// Member permissions
		{
			url: /^\/members/,
			method: 'GET',
			permission: {
				subscriptions: 'view',
			},
		},
		{
			url: /^\/members\/delete/,
			method: 'GET',
			permission: {
				subscriptions: 'delete',
			},
		},
		{
			url: /^\/members\/create/,
			method: 'GET',
			permission: {
				subscriptions: 'create',
			},
		},
		{
			url: /^\/members\/.*/,
			method: 'GET',
			permission: {
				subscriptions: 'update',
			},
		},
		{
			url: /^\/members\/update\/.*/,
			method: 'POST',
			permission: {
				subscriptions: 'update',
			},
		},
		{
			url: /^\/subscriptions$/,
			method: 'POST',
			permission: {
				subscriptions: 'update',
			},
		},
		{
			url: /^\/subscriptions.*/,
			method: 'GET',
			permission: {
				movies: 'view',
			},
		},
	];

	var requiredPermission = requiredPermissions.find(requiredPermission => {
		var routeMatch = requiredPermission.url.test(currRoute.url);
		var result = routeMatch && requiredPermission.method == currRoute.method;
		return result;
	});
	if (requiredPermission) {
		var [data, permission] = Object.entries(requiredPermission.permission)[0];
		var hasPermission = user.permissions[data][permission];
		return hasPermission;
	}

	return false;
}
