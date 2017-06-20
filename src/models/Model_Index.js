/*
* @Author: KaileDing
* @Date:   2017-06-05 10:58:17
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-20 00:07:38
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
let CollectMoments = dbConnectionPool.import(__dirname + "/CollectMoment");
let CollectQuestions = dbConnectionPool.import(__dirname + "/CollectQuestion");
let CollectAnswers = dbConnectionPool.import(__dirname + "/CollectAnswer");

Moments.belongsTo(Users, {
	foreignKey: 'createdBy',
	targetKey: 'id'
});

Answers.belongsTo(Users, {
	foreignKey: 'createdBy',
	targetKey: 'id'
});

Collections.belongsTo(Users, {
	foreignKey: 'createdBy',
	targetKey: 'id'
});

CommentsForAnswer.belongsTo(Users, {
	foreignKey: 'createdBy',
	targetKey: 'id'
});

CommentsForMoment.belongsTo(Users, {
	foreignKey: 'createdBy',
	targetKey: 'id'
});

Locations.belongsTo(Users, {
	foreignKey: 'createdBy',
	targetKey: 'id'
});

Questions.belongsTo(Users, {
	foreignKey: 'createdBy',
	targetKey: 'id'
});

VotesForAnswers.belongsTo(Users, {
	foreignKey: 'createdBy',
	targetKey: 'id'
});

VotesForAnswers.belongsTo(Answers, {
	foreignKey: 'answer_id',
	targetKey: 'id'
});

VotesForMoments.belongsTo(Users, {
	foreignKey: 'createdBy',
	targetKey: 'id'
});

VotesForMoments.belongsTo(Moments, {
	foreignKey: 'moment_id',
	targetKey: 'id'
});

VotesForQuestions.belongsTo(Users, {
	foreignKey: 'createdBy',
	targetKey: 'id'
});

VotesForQuestions.belongsTo(Questions, {
	foreignKey: 'question_id',
	targetKey: 'id'
});


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
	VotesForQuestions,
	CollectMoments,
	CollectQuestions,
	CollectAnswers
}
