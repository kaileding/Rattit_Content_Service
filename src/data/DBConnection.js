/*
* @Author: KaileDing
* @Date:   2017-06-05 09:02:35
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-13 12:17:32
*/

'use strict';
import Sequelize from 'sequelize'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();

let databaseName = process.env.DB_NAME;
let username = process.env.DB_USER;
let password = process.env.DB_PSWD;
let hostname = process.env.DB_HOST;
let maxConnection = process.env.DB_MAX_CONNECTIONS;

var sequelize  = new Sequelize(databaseName, username, password, {
	dialect: 'postgres',
	host: hostname,
	logging: cLogger.logSQL,
	pool: {
		max: (maxConnection || 10),
		min: 0,
		idle: 5000
	}
});

module.exports = sequelize;