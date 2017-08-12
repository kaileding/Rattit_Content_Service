/*
* @Author: KaileDing
* @Date:   2017-06-12 16:47:56
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-12 03:06:29
*/

'use strict';
import httpStatus from 'http-status'
import Promise from 'bluebird'
import commentForAnswerRequestValidator from '../Validators/CommentForAnswerRequestValidator'
import CommentForAnswersHandler from '../handlers/CommentForAnswersHandler'
import AnswersHandler from '../handlers/AnswersHandler'
import DynamoNotificationsHandler from '../handlers/DynamoNotificationsHandler'
import models from '../models/Model_Index'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();
let commentForAnswersHandler = new CommentForAnswersHandler();
let answersHandler = new AnswersHandler();
let notificationsHandler = new DynamoNotificationsHandler();

module.exports = {
	postCommentForAnAnswer: function(req, res, next) {
		commentForAnswerRequestValidator.validateCreateCommentRequest(req).then(validationRes => {

			var newComment = {
				for_answer: req.body.for_answer,
				for_comment: req.body.for_comment,
				words: req.body.words,
				createdBy: req.user_id
			};
			var pgReqs = [
				commentForAnswersHandler.createEntryForModel(newComment),
				answersHandler.findEntryByIdFromModel(newComment.for_answer)
			];
			if (newComment.for_comment) {
				pgReqs.push(commentForAnswersHandler.findEntryByIdFromModel(newComment.for_comment));
			}
			return Promise.all(pgReqs).then(pgRes => {
				cLogger.say('save one comment for answer successfully.', pgRes);
				res.status(httpStatus.CREATED).send(pgRes[0]);
				notificationsHandler.insertActivityToNotificationTable({
					recipient: pgRes[1].createdBy,
					actor: newComment.createdBy,
					action: 'comment',
					target: 'answer:'+newComment.for_answer,
					actionTime: pgRes[0].createdAt
				}).then(notifyRes => {
					cLogger.say('Successfully added into DynamoDB Notification Table.');
				}).catch(notifyError => {
					cLogger.debug('Failed to add into DynamoDB Notification Table.');
				});
				if (newComment.for_comment) {
					notificationsHandler.insertActivityToNotificationTable({
						recipient: pgRes[2].createdBy,
						actor: newComment.createdBy,
						action: 'reply_comment',
						target: 'comment_for_answer:'+newComment.for_comment,
						actionTime: pgRes[0].createdAt
					}).then(notifyRes => {
						cLogger.say('Successfully added into DynamoDB Notification Table.');
					}).catch(notifyError => {
						cLogger.debug('Failed to add into DynamoDB Notification Table.');
					});
				}
			}).catch(pgError => {
				next(pgError);
			});

			// return commentForAnswersHandler.createEntryForModel({
			// 		for_answer: req.body.for_answer,
			// 		for_comment: req.body.for_comment,
			// 		words: req.body.words,
			// 		createdBy: req.user_id
			// 	}).then(result => {
	        //         cLogger.say('save one comment for moment successfully.', result);
	        //         res.status(httpStatus.CREATED).send(result);
			// 	}).catch(error => {
			// 		next(error);
			// 	});

		}).catch(error => {
			next(error);
		})
	},

	getCommentForAnswerById: function(req, res, next) {
		commentForAnswerRequestValidator.validateGetCommentByIdRequest(req).then(result => {

			return commentForAnswersHandler.findEntryByIdFromModel(req.params.id).then(result => {
                    res.status(httpStatus.OK).send(result);
                }).catch(err => {
                    next(err);
                });

		}).catch(error => {
			next(error);
		});
	},

	getCommentsForAnswerByQuery: function(req, res, next) {
		commentForAnswerRequestValidator.validateGetCommentsByQueryRequest(req).then(result => {

            var queryObj = {
				dialog_format: req.query.dialog_format,
            	for_answer: req.query.for_answer,
            	for_comment: req.query.for_comment,
                text: req.query.text,
                author_id: req.query.author_id,
                queryDateType: req.query.date_query_type,
                dateLine: req.query.date_query_line,
                limit: req.query.limit,
                offset: req.query.offset,
        		voted_type: req.query.voted_type,
        		voted_by: req.query.voted_by
            };

            return commentForAnswersHandler.findCommentsByQuery(queryObj)
                        .then(function(results) {
                            res.status(httpStatus.OK).send(results);
                        }).catch(function(error) {
                            next(error);
                        });

		}).catch(error => {
			next(error);
		})
	},

	deleteCommentForAnswer: function(req, res, next) {
		commentForAnswerRequestValidator.validateGetCommentByIdRequest(req).then(result => {

			return commentForAnswersHandler.updateEntryByIdForModel(req.params.id, {
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

	castOrChangeVoteForCommentForAnswer: function(req, res, next) {
		commentForAnswerRequestValidator.validateVoteForACommentRequest(req).then(validationRes => {

			let voteForComment = {
				vote_type: req.body.type,
				voted_by: req.params.voterId,
				commit: req.body.commit
			};

			return Promise.all([
				ommentForAnswersHandler.updateVoteOfCommentForMoment(req.params.id, voteForComment),
				ommentForAnswersHandler.findEntryByIdFromModel(req.params.id)
			]).then(pgRes => {
				res.status(httpStatus.OK).send(pgRes[0]);
				return answersHandler.findEntryByIdFromModel(pgRes[1].for_answer).then(answerRes => {
					notificationsHandler.insertActivityToNotificationTable({
						recipient: answerRes.createdBy,
						actor: voteForComment.voted_by,
						action: voteForComment.vote_type,
						target: 'comment_for_answer:'+req.params.id,
						actionTime: pgRes[0].createdAt
					}).then(notifyRes => {
						cLogger.say(notifyRes);
					}).catch(notifyError => {
						cLogger.debug(notifyError);
					});
					notificationsHandler.insertActivityToNotificationTable({
						recipient: pgRes[1].createdBy,
						actor: voteForComment.voted_by,
						action: voteForComment.vote_type,
						target: 'comment_for_answer:'+req.params.id,
						actionTime: pgRes[0].createdAt
					}).then(notifyRes => {
						cLogger.say(notifyRes);
					}).catch(notifyError => {
						cLogger.debug(notifyError);
					});
				}).catch(momentError => {
					cLogger.debug('Failed to get answer.');
				});
			}).catch(pgError => {
				next(pgError);
			});
			// return commentForAnswersHandler.updateVoteOfCommentForMoment(req.params.id, voteForComment).then(result => {
			// 	res.status(httpStatus.OK).send(result);
			// }).catch(error => {
			// 	next(error);
			// });

		}).catch(error => {
			next(error);
		});

	}

}