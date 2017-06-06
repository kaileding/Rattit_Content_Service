/*
* @Author: KaileDing
* @Date:   2017-06-05 10:58:17
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-05 22:50:13
*/

'use strict';
import dbConnectionPool from '../data/DBConnection'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();

let Locations = dbConnectionPool.import(__dirname + "/Location");
let Users = dbConnectionPool.import(__dirname + "/User");
let UserRelationships = dbConnectionPool.import(__dirname + "/UserRelationship");
let Moments = dbConnectionPool.import(__dirname + "/Moment");
let Collections = dbConnectionPool.import(__dirname + "/Collection");
let Questions = dbConnectionPool.import(__dirname + "/Question");
let Answers = dbConnectionPool.import(__dirname + "/Answer");
let CommentsForMoment = dbConnectionPool.import(__dirname + "/CommentForMoment");
let CommentsForAnswer = dbConnectionPool.import(__dirname + "/CommentForAnswer");

module.exports = {
	Locations,
	Users,
	UserRelationships,
	Moments,
	Collections,
	Questions,
	Answers,
	CommentsForMoment,
	CommentsForAnswer
}
