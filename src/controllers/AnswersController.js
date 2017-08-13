/*
* @Author: KaileDing
* @Date:   2017-06-11 23:51:27
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-12 17:09:59
*/

'use strict';
import httpStatus from 'http-status'
import Promise from 'bluebird'
import consts from '../config/Constants'
import answerRequestValidator from '../Validators/AnswerRequestValidator'
import AnswersHandler from '../handlers/AnswersHandler'
import VotesForAnswersHandler from '../handlers/VotesForAnswersHandler'
import UserRelationshipsHandler from '../handlers/UserRelationshipsHandler'
import DynamoFeedsHandler from '../handlers/DynamoFeedsHandler'
import DynamoActivitiesHandler from '../handlers/DynamoActivitiesHandler'
import DynamoHotPostsHandler from '../handlers/DynamoHotPostsHandler'
import DynamoNotificationsHandler from '../handlers/DynamoNotificationsHandler'
import models from '../models/Model_Index'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();
let answersHandler = new AnswersHandler();
let votesForAnswersHandler = new VotesForAnswersHandler();
let userRelationshipsHandler = new UserRelationshipsHandler();
let feedsHandler = new DynamoFeedsHandler();
let activitiesHandler = new DynamoActivitiesHandler();
let hotPostsHandler = new DynamoHotPostsHandler();
let notificationsHandler = new DynamoNotificationsHandler();

let updateVotesNumberOfAnswer = function(vote_type, answer_id) {
	return new Promise((resolve, reject) => {
			votesForAnswersHandler.countEntriesFromModelForFilter({
					vote_type: vote_type,
					answer_id: answer_id
				}).then(result => {

					var updateField = {};
					switch(vote_type) {
						case 'agree':
						updateField = {agree_number: result};
						break;
						case 'disagree':
						updateField = {disagree_number: result};
						break;
						case 'admire':
						updateField = {admirer_number: result};
						break;
						default:
						break;
					}

					return answersHandler.updateEntryByIdForModel(answer_id, updateField).then(result => {
						resolve(result);
					}).catch(error => {
						reject(error);
					});
				}).catch(error => {
					reject(error);
				});
		});
};

module.exports = {
	postAnswer: function(req, res, next) {
		answerRequestValidator.validateCreateAnswerRequest(req).then(result => {
			
			var newAnswerObj = {
				for_question: req.body.for_question,
				words: req.body.words,
				photos: req.body.photos,
				hash_tags: req.body.hash_tags,
				attachment: req.body.attachment,
				createdBy: req.user_id
			};

			var queries = [];
			queries.push(userRelationshipsHandler.findFollowerIdsByUserId(req.user_id));
			queries.push(answersHandler.createEntryForModel(newAnswerObj).then(result => {
				cLogger.say('save one answer successfully.', result);
				return result;
			}));

			return Promise.all(queries).then(results => {
				let followerIds = results[0].followerIds;
				let createdAnswer = results[1];
				let activity = {
					actor: req.user_id,
					action: 'post',
					target: 'answer:'+createdAnswer.id,
					actionTime: createdAnswer.createdAt,
					associateInfo: {
						forQuestionId: { S: 'question:'+createdAnswer.for_question }
					}
				};

				res.status(httpStatus.CREATED).send(createdAnswer);

				var dynamoReqs = [];
				dynamoReqs.push(activitiesHandler.insertActivityToAuthorTable(activity));
				if (followerIds.length > consts.DYNAMO_THRESHOLD_OF_FOLLOWERNUM) {
					activity.hotType = 'Popular';
					dynamoReqs.push(hotPostsHandler.insertActivityToHotTable(activity));
				} else if (followerIds.length > 0) {
					dynamoReqs.push(feedsHandler.insertActivityToFeedsOfFollowers(activity, followerIds));
				}
				return Promise.all(dynamoReqs).then(dynamoRes => {
					cLogger.say('Successfully Insert This Answer to ActivityTable and FeedTable.');
				}).catch(dynamoError => {
					next(dynamoError);
				});
			}).catch(error => {
				next(error);
			});

		}).catch(error => {
			next(error);
		})
	},

	getAnswerById: function(req, res, next) {
		answerRequestValidator.validateGetAnswerByIdRequest(req).then(result => {

			return answersHandler.findEntryByIdFromModel(req.params.id).then(result => {
                    res.status(httpStatus.OK).send(result);
                }).catch(err => {
                    next(err);
                });

		}).catch(error => {
			next(error);
		});
	},

	getAnswersByQuery: function(req, res, next) {
		answerRequestValidator.validateGetAnswersByQueryRequest(req).then(result => {

            var queryObj = {
            	for_question: req.query.for_question,
                text: req.query.text,
                author_id: req.query.author_id,
                queryDateType: req.query.date_query_type,
                dateLine: req.query.date_query_line,
                limit: req.query.limit,
                offset: req.query.offset,
                joinWithVotes: false
            };
            if (req.query.voted_type && req.query.voted_by) {
            	queryObj.joinWithVotes = true;
            	queryObj.joinOptions = {
            		voted_type: req.query.voted_type,
            		voted_by: req.query.voted_by
            	};
            }

            return answersHandler.findAnswersByQuery(queryObj)
                        .then(function(results) {
                            res.status(httpStatus.OK).send(results);
                        }).catch(function(error) {
                            next(error);
                        });

		}).catch(error => {
			next(error);
		})
	},

	updateAnswer: function(req, res, next) {
		answerRequestValidator.validateUpdateAnswerRequest(req).then(result => {

            var updateObj = {};
            if (req.body.words) {
                updateObj.words = req.body.words;
            }
            if (req.body.photos) {
                updateObj.photos = req.body.photos;
            }
            if (req.body.hash_tags) {
                updateObj.hash_tags = req.body.hash_tags;
            }
            if (req.body.attachment) {
                updateObj.attachment = req.body.attachment;
            }

            return answersHandler.updateEntryByIdForModel(req.params.id, updateObj).then(result => {
            	res.status(httpStatus.OK).send(result);
            }).catch(error => {
            	next(error);
            });

		}).catch(error => {
			next(error);
		});
	},

	deleteAnswer: function(req, res, next) {
		answerRequestValidator.validateGetAnswerByIdRequest(req).then(result => {

			return answersHandler.updateEntryByIdForModel(req.params.id, {
				deletedAt: new Date()
			}).then(result => {
				res.status(httpStatus.OK).send(result);
			}).catch(error => {
				next(error);
			});

		}).catch(error => {
			next(error);
		});
	},

	castOrChangeVoteForAnswer: function(req, res, next) {
		answerRequestValidator.validateVoteForAnAnswerRequest(req).then(validationRes => {

			let voteForAnswer = {
				vote_type: req.body.type,
				answer_id: req.params.id,
				createdBy: req.params.voterId
			};

			if (req.body.commit) {
				return Promise.all([
					votesForAnswersHandler.createEntryForModel(voteForAnswer),
					answersHandler.findEntryByIdFromModel(voteForAnswer.answer_id)
				]).then(pgRes => {
					cLogger.say('create a vote for answer successfully.', pgRes);
					notificationsHandler.insertActivityToNotificationTable({
						recipient: pgRes[1].createdBy,
						actor: voteForAnswer.createdBy,
						action: 'answer:'+voteForAnswer.vote_type,
						target: 'answer:'+voteForAnswer.answer_id,
						actionTime: pgRes[0].createdAt
					}).then(notifyRes => {
						cLogger.say('Successfully added into DynamoDB Notification Table.');
					}).catch(notifyError => {
						cLogger.debug('Failed to add into DynamoDB Notification Table.');
					});
	                return updateVotesNumberOfAnswer(voteForAnswer.vote_type, voteForAnswer.answer_id).then(result => {
	                	res.status(httpStatus.OK).send(result);
	                }).catch(error => {
	                	next(error);
	                });
				}).catch(pgError => {
					next(pgError);
				});
			} else {
				return votesForAnswersHandler.deleteVoteForAnswerByContent(voteForAnswer).then(result => {
	                cLogger.say('revote a vote for answer successfully.', result);
	                return updateVotesNumberOfAnswer(voteForAnswer.vote_type, voteForAnswer.answer_id).then(result => {
	                	res.status(httpStatus.OK).send(result);
	                }).catch(error => {
	                	next(error);
	                });

				}).catch(error => {
					next(error);
				});
			}

		}).catch(error => {
			next(error);
		});

	},

	getVotersForAnswerId: function(req, res, next) {
		answerRequestValidator.validateGetVotesForAnswerIdRequest(req).then(result => {

			let queryObj = {
				voter_id: req.query.voter_id,
				vote_type: req.query.vote_type,
				answer_id: req.params.id,
				limit: req.query.limit,
				offset: req.query.offset
			};

			return votesForAnswersHandler.findVotesForAnswersByQuery(queryObj).then(results => {
				res.status(httpStatus.OK).send(results);
			}).catch(error => {
				next(error);
			});

		}).catch(error => {
			next(error);
		});
	}

}