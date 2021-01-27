import express from 'express';
import path from 'path';
import session from 'express-session';
import connectMongoDBSession from 'connect-mongodb-session';

import flash from 'connect-flash';

import connectDB from './DB/Connection';
import menuRoutes from './routes/menu';
import authRouter from './routes/auth';
import userRouter from './routes/user';
import movieRouter from './routes/movies';
import memberRouter from './routes/members';
import subscriptionRouter from './routes/subscriptions';
import setLocals from './BL/middleware/setLocals';

import * as authController from './BL/auth';

connectDB();

const MongoDBStore = connectMongoDBSession(session);

const store = new MongoDBStore({
	uri: process.env.DB_URI,
	collection: 'sessions',
});
const isProd = process.env.NODE_ENV === 'production';
let webpackDevMiddleware;
let webpackHotMiddleware;
console.log(`node env = ${process.env.NODE_ENV}`);
if (!isProd) {
	const webpack = require('webpack');
	const config = require('./config/webpack.dev');
	const compiler = webpack(config);
	webpackDevMiddleware = require('webpack-dev-middleware')(compiler, {
		writeToDisk: filePath => {
			// instruct the dev server to the home.html file to disk
			// so that the route handler will be able to read it
			return /.+\.css$/.test(filePath);
		},
	});
	webpackHotMiddleware = require('webpack-hot-middleware')(compiler);
}

/**
 *
 *  global app variables
 *
 * */
const app = express();
/** CORS headers */
app.use((req, res, next) => {
	console.log('request arrived');
	next();
});

/**
 * data middleware
 */
const dataMW = (function (app) {
	app.use(express.json({ extended: false }));
	app.use(express.urlencoded({ extended: true }));
})(app);

/**
 *
 * Session middleware
 *
 */

const sessionMW = (function (app) {
	app.use(
		session({
			secret: 'keyboard cat',
			resave: false,
			saveUninitialized: false,
			store,
		})
	);
})(app);

/**
 * flash Middleware
 *
 */
const flasHMW = (app => {
	app.use(flash());
})(app);

/**
 * Webpack middleware
 */
if (!isProd) {
	const webpackMW = (function (app) {
		app.use(webpackDevMiddleware);
		app.use(webpackHotMiddleware);
	})(app);
}

/**
 *
 * General Middleware
 *
 */

const generalMW = (function (app) {
	app.use(express.static(path.join(__dirname, '../dist')));
	app.use(express.static(path.join(__dirname, '../fonts')));
})(app);

/**
 * locals MW
 */

app.use(setLocals);

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Methods',
		'OPTIONS, GET, POST, PUT, PATCH, DELETE'
	);
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	next();
});

/**Menu Routes */
app.get('/', menuRoutes);
/**Movies Routes */

app.use('/movies', movieRouter);
/**Members Routes */
app.use('/members', memberRouter);
/**Subscriptions Routes */
app.use('/subscriptions', subscriptionRouter);
/**User Routes */
app.use('/users', userRouter);

/**Auth Routes */
app.use('/auth', authRouter);
app.get('/login', authController.getLogin);
app.get('/logout', authController.getLogout);
app.put('/signup');
app.use(function notFound(req, res) {
	res.status(404).end();
});

app.use(function errorHandler(error, req, res, next) {
	console.log(error);
	const status = error.statusCode || 500;
	const message = error.message;
	const data = error.data;
	res.status(status).json({ message, data });
});

const connect = (async function (app) {
	const PORT = process.env.PORT || 8080;
	app.listen(PORT, () => {
		console.log(`app is listening on port http://localhost:${PORT}`);
	});
})(app);
