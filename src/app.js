/*
* @Author: KaileDing
* @Date:   2017-05-27 16:01:43
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-09 21:09:45
*/

'use strict';

import express from 'express'
import http from 'http'
import {} from 'dotenv/config'
import path from 'path'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import auth from 'http-auth'
import httpStatus from 'http-status'
import expressValidator from 'express-validator'
import APIError from './helpers/APIError'
import customValidations from './Validators/CustomValidations'
import dbConnectionPool from './data/DBConnection'
import indexRoutes from './routes/index'

let app = express();

app.set('env', process.env.NODE_ENV);
app.use(morgan('combined'));
app.use(bodyParser.json({
	limit: '50mb'
}));
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(expressValidator(customValidations));

app.all('/*', function (req, res, next) {
    // CORS headers
    res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,Authorization');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

app.get('/', (req, res, next) => {
    res.redirect('/api/v1')
});

app.use('/api/v1', indexRoutes);

let basic = auth.basic({
        realm: "Authorized users only"
    }, function (username, password, callback) { // Custom authentication method.
        callback(username === "rattit" && password === "5star");
    }
);

app.use('/docs', auth.connect(basic));

app.use(function (req, res, next) {
	const apiError = new APIError('API Endpoint Not Found', httpStatus.NOT_FOUND);
	return next(apiError);
});

app.use((err, req, res, next) => {
	if (!(err instanceof APIError)) { // if error is not an instanceOf APIError, convert it.
		var apiError = new APIError(err.message);
		res.status(apiError.statusCode).send(apiError.getFormattedJson());
	} else {
		res.status(err.statusCode).send(err.getFormattedJson());
	}
});

console.log(app.get('env'));

dbConnectionPool.authenticate().then(function(err) {
	console.log('Database Connection has been established successfully.');
}).catch(function (err) {
	console.log('Unable to connect to the database:', err);
});


let port = process.env.PORT || '3500';
app.set('port', port);

let server = http.createServer(app);
server.listen(port, function() {
	console.log(`Server started on port ${port}.`);
});
server.on('error', function(e) {
	if (e.syscall !== 'listen') {
		throw e;
	}
	switch (e.code) {
		case 'EACCES':
			console.error(`${port} requires elevated privileges.`);
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(`${port} is already in use.`);
			process.exit(1);
			break;
		default:
			throw e;
	}
});

module.exports = app;
