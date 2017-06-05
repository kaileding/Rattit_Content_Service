/*
* @Author: KaileDing
* @Date:   2017-06-05 10:58:17
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-05 14:25:43
*/

'use strict';
import dbConnectionPool from './data/DBConnection'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();

let Locations = dbConnectionPool.import(__dirname + "/Location");
let Moments = dbConnectionPool.import(__dirname + "/Moment");
let Collections = dbConnectionPool.import(__dirname + "/Collection");

module.exports = {
	Locations,
	Moments,
	Collections
}
