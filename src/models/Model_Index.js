/*
* @Author: KaileDing
* @Date:   2017-06-05 10:58:17
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-11 14:42:02
*/

'use strict';
import dbConnectionPool from '../data/DBConnection'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();

let Users = dbConnectionPool.import(__dirname + "/User");
let Locations = dbConnectionPool.import(__dirname + "/Location");
let UserRelationships = dbConnectionPool.import(__dirname + "/UserRelationship");
let Moments = dbConnectionPool.import(__dirname + "/Moment");
let Collections = dbConnectionPool.import(__dirname + "/Collection");
let Questions = dbConnectionPool.import(__dirname + "/Question");
let Answers = dbConnectionPool.import(__dirname + "/Answer");
let CommentsForMoment = dbConnectionPool.import(__dirname + "/CommentForMoment");
let CommentsForAnswer = dbConnectionPool.import(__dirname + "/CommentForAnswer");
let VotesForAnswers = dbConnectionPool.import(__dirname + "/VotesForAnswer");
let VotesForMoments = dbConnectionPool.import(__dirname + "/VotesForMoment");
let VotesForQuestions = dbConnectionPool.import(__dirname + "/VotesForQuestion");


module.exports = {
	Users,
	Locations,
	UserRelationships,
	Moments,
	Collections,
	Questions,
	Answers,
	CommentsForMoment,
	CommentsForAnswer,
	VotesForAnswers,
	VotesForMoments,
	VotesForQuestions
}
