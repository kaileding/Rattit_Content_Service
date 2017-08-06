/*
* @Author: KaileDing
* @Date:   2017-06-11 23:51:27
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-06 16:33:52
*/

'use strict';
import httpStatus from 'http-status'
import Promise from 'bluebird'
import answerRequestValidator from '../Validators/AnswerRequestValidator'
import AnswersHandler from '../handlers/AnswersHandler'
import VotesForAnswersHandler from '../handlers/VotesForAnswersHandler'
import models from '../models/Model_Index'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();
let answersHandler = new AnswersHandler();
let votesForAnswersHandler = new VotesForAnswersHandler();

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

			return answersHandler.createEntryForModel({
					for_question: req.body.for_question,
					words: req.body.words,
					photos: req.body.photos,
					hash_tags: req.body.hash_tags,
					attachment: req.body.attachment,
					createdBy: req.user_id
				}).then(result => {
	                cLogger.say(cLogger.TESTING_TYPE, 'save one answer successfully.', result);
	                res.status(httpStatus.CREATED).send(result);
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
		answerRequestValidator.validateVoteForAnAnswerRequest(req).then(result => {

			let voteForAnswer = {
				vote_type: req.body.type,
				answer_id: req.params.id,
				createdBy: req.params.voterId
			};

			if (req.body.commit) {
				return votesForAnswersHandler.createEntryForModel(voteForAnswer).then(result => {
	                cLogger.say(cLogger.TESTING_TYPE, 'create a vote for answer successfully.', result);
	                return updateVotesNumberOfAnswer(voteForAnswer.vote_type, voteForAnswer.answer_id).then(result => {
	                	res.status(httpStatus.OK).send(result);
	                }).catch(error => {
	                	next(error);
	                });

				}).catch(error => {
					next(error);
				});
			} else {
				return votesForAnswersHandler.deleteVoteForAnswerByContent(voteForAnswer).then(result => {
	                cLogger.say(cLogger.TESTING_TYPE, 'revote a vote for answer successfully.', result);
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