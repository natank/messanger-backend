const path = require('path');
require('dotenv').config();
require('@babel/register');

if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config({ path: path.join(__dirname, '../config/vars') });
	console.log(
		`read configuration file from ${path.join(__dirname, '../config')}`
	);
}
console.log(`node environment: ${process.env.NODE_ENV}`);
require('./app');
