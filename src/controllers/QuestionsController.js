/*
* @Author: KaileDing
* @Date:   2017-06-11 21:48:57
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-12 23:28:11
*/

'use strict';
import httpStatus from 'http-status'
import Promise from 'bluebird'
import questionRequestValidator from '../Validators/QuestionRequestValidator'
import QuestionsHandler from '../handlers/QuestionsHandler'
import VotesForQuestionsHandler from '../handlers/VotesForQuestionsHandler'
import models from '../models/Model_Index'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();
let questionsHandler = new QuestionsHandler();
let votesForQuestionsHandler = new VotesForQuestionsHandler();

let updateVotesNumberOfQuestion = function(vote_type, question_id) {
	return new Promise((resolve, reject) => {
			votesForQuestionsHandler.countEntriesFromModelForFilter({
					vote_type: vote_type,
					question_id: question_id
				}).then(result => {

					var updateField = {};
					switch(vote_type) {
						case 'interest':
						updateField = {interests_number: result};
						break;
						case 'invite':
						updateField = {invites_number: result};
						break;
						case 'pity':
						updateField = {pitys_number: result};
						break;
						default:
						break;
					}

					return questionsHandler.updateEntryByIdForModel(question_id, updateField).then(result => {
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
	postQuestion: function(req, res, next) {
		questionRequestValidator.validateCreateQuestionRequest(req).then(result => {

			return questionsHandler.createEntryForModel({
					title: req.body.title,
					words: req.body.words,
					photos: req.body.photos,
					hash_tags: req.body.hash_tags,
					attachment: req.body.attachment,
					location_id: req.body.location_id,
					access_level: req.body.access_level,
					createdBy: req.user_id
				}).then(result => {
	                cLogger.say(cLogger.TESTING_TYPE, 'save one question successfully.', result);
	                res.status(httpStatus.OK).send(result);
				}).catch(error => {
					next(error);
				});

		}).catch(error => {
			next(error);
		})
	},

	getQuestionById: function(req, res, next) {
		questionRequestValidator.validateGetQuestionByIdRequest(req).then(result => {

			return questionsHandler.findEntryByIdFromModel(req.params.id).then(result => {
                    res.status(httpStatus.OK).send(result);
                }).catch(err => {
                    next(err);
                });

		}).catch(error => {
			next(error);
		});
	},

	getQuestionsByQuery: function(req, res, next) {
		questionRequestValidator.validateGetQuestionsByQueryRequest(req).then(result => {

            var queryObj = {
                text: req.query.text,
                location_id: req.query.location_id,
                author_id: req.query.author_id,
                limit: req.query.limit,
                offset: req.query.offset,
                joinWithVotes: false
            };
            if (req.query.voted_type && (req.query.voted_by || req.query.subject_id)) {
            	queryObj.joinWithVotes = true;
            	queryObj.joinOptions = {
            		voted_type: req.query.voted_type,
            		voted_by: req.query.voted_by,
            		subject_id: req.query.subject_id
            	};
            }

            return questionsHandler.findQuestionsByQuery(queryObj)
                        .then(function(results) {
                            res.status(httpStatus.OK).send(results);
                        }).catch(function(error) {
                            next(error);
                        });

		}).catch(error => {
			next(error);
		})
	},

	updateQuestion: function(req, res, next) {
		questionRequestValidator.validateUpdateQuestionRequest(req).then(result => {

            var updateObj = {};
            if (req.body.title) {
                updateObj.title = req.body.title;
            }
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
            if (req.body.location_id) {
                updateObj.location_id = req.body.location_id;
            }
            if (req.body.access_level) {
                updateObj.access_level = req.body.access_level;
            }

            return questionsHandler.updateEntryByIdForModel(req.params.id, updateObj).then(result => {
            	res.status(httpStatus.OK).send(result);
            }).catch(error => {
            	next(error);
            });

		}).catch(error => {
			next(error);
		});
	},

	deleteQuestion: function(req, res, next) {
		questionRequestValidator.validateGetQuestionByIdRequest(req).then(result => {

			return questionsHandler.updateEntryByIdForModel(req.params.id, {
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

	castOrChangeVoteForQuestion: function(req, res, next) {
		questionRequestValidator.validateVoteForAQuestionRequest(req).then(result => {

			let voteForQuestion = {
				vote_type: req.body.type,
				subject_id: req.body.subject_id,
				question_id: req.params.id,
				createdBy: req.params.voterId
			};

			if (req.body.commit) {
				return votesForQuestionsHandler.createEntryForModel(voteForQuestion).then(result => {
	                cLogger.say(cLogger.TESTING_TYPE, 'create a vote for question successfully.', result);
	                return updateVotesNumberOfQuestion(voteForQuestion.vote_type, voteForQuestion.question_id).then(result => {
	                	res.status(httpStatus.OK).send(result);
	                }).catch(error => {
	                	next(error);
	                });

				}).catch(error => {
					next(error);
				});
			} else {
				return votesForQuestionsHandler.deleteVoteForQuestionByContent(voteForQuestion).then(result => {
	                cLogger.say(cLogger.TESTING_TYPE, 'revote a vote for question successfully.', result);
	                return updateVotesNumberOfQuestion(voteForQuestion.vote_type, voteForQuestion.question_id).then(result => {
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

	}

}