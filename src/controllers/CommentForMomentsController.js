/*
* @Author: KaileDing
* @Date:   2017-06-12 01:51:30
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-12 03:08:20
*/

'use strict';
import httpStatus from 'http-status'
import Promise from 'bluebird'
import commentForMomentRequestValidator from '../Validators/CommentForMomentRequestValidator'
import CommentForMomentsHandler from '../handlers/CommentForMomentsHandler'
import MomentsHandler from '../handlers/MomentsHandler'
import DynamoNotificationsHandler from '../handlers/DynamoNotificationsHandler'
import models from '../models/Model_Index'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();
let commentForMomentsHandler = new CommentForMomentsHandler();
let momentsHandler = new MomentsHandler();
let notificationsHandler = new DynamoNotificationsHandler();

module.exports = {
	postCommentForAMoment: function(req, res, next) {
		commentForMomentRequestValidator.validateCreateCommentRequest(req).then(validationRes => {

			var newComment = {
				for_moment: req.body.for_moment,
				for_comment: req.body.for_comment,
				words: req.body.words,
				photos: req.body.photos,
				hash_tags: req.body.hash_tags,
				createdBy: req.user_id
			};
			var pgReqs = [
				commentForMomentsHandler.createEntryForModel(newComment),
				momentsHandler.findEntryByIdFromModel(newComment.for_moment)
			];
			if (newComment.for_comment) {
				pgReqs.push(commentForMomentsHandler.findEntryByIdFromModel(newComment.for_comment));
			}
			return Promise.all(pgReqs).then(pgRes => {
				cLogger.say('save one comment for moment successfully.', pgRes);
				res.status(httpStatus.CREATED).send(pgRes[0]);
				notificationsHandler.insertActivityToNotificationTable({
					recipient: pgRes[1].createdBy,
					actor: newComment.createdBy,
					action: 'comment',
					target: 'moment:'+newComment.for_moment,
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
						target: 'comment_for_moment:'+newComment.for_comment,
						actionTime: pgRes[0].createdAt
					}).then(notifyRes => {
						cLogger.say('Successfully added into DynamoDB Notification Table.');
					}).catch(notifyError => {
						cLogger.debug('Failed to add into DynamoDB Notification Table.');
					});
				}
			}).catch(error => {
				next(error);
			});
			// return commentForMomentsHandler.createEntryForModel(newComment).then(result => {
	        //         cLogger.say('save one comment for moment successfully.', result);
			// 		res.status(httpStatus.CREATED).send(result);
			// 	}).catch(error => {
			// 		next(error);
			// 	});

		}).catch(error => {
			next(error);
		})
	},

	getCommentForMomentById: function(req, res, next) {
		commentForMomentRequestValidator.validateGetCommentByIdRequest(req).then(result => {

			return commentForMomentsHandler.findEntryByIdFromModel(req.params.id).then(result => {
                    res.status(httpStatus.OK).send(result);
                }).catch(err => {
                    next(err);
                });

		}).catch(error => {
			next(error);
		});
	},

	getCommentsForMomentByQuery: function(req, res, next) {
		commentForMomentRequestValidator.validateGetCommentsByQueryRequest(req).then(result => {

            var queryObj = {
				dialog_format: req.query.dialog_format,
            	for_moment: req.query.for_moment,
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

            return commentForMomentsHandler.findCommentsByQuery(queryObj)
                        .then(function(results) {
                            res.status(httpStatus.OK).send(results);
                        }).catch(function(error) {
                            next(error);
                        });

		}).catch(error => {
			next(error);
		})
	},

	deleteCommentForMoment: function(req, res, next) {
		commentForMomentRequestValidator.validateGetCommentByIdRequest(req).then(result => {

			return commentForMomentsHandler.updateEntryByIdForModel(req.params.id, {
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

	castOrChangeVoteForCommentForMoment: function(req, res, next) {
		commentForMomentRequestValidator.validateVoteForACommentRequest(req).then(validationRes => {

			let voteForComment = {
				vote_type: req.body.type,
				voted_by: req.params.voterId,
				commit: req.body.commit
			};

			return Promise.all([
				commentForMomentsHandler.updateVoteOfCommentForMoment(req.params.id, voteForComment),
				commentForMomentsHandler.findEntryByIdFromModel(req.params.id)
			]).then(pgRes => {
				res.status(httpStatus.OK).send(pgRes[0]);
				return momentsHandler.findEntryByIdFromModel(pgRes[1].for_moment).then(momentRes => {
					notificationsHandler.insertActivityToNotificationTable({
						recipient: momentRes.createdBy,
						actor: voteForComment.voted_by,
						action: voteForComment.vote_type,
						target: 'comment_for_moment:'+req.params.id,
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
						target: 'comment_for_moment:'+req.params.id,
						actionTime: pgRes[0].createdAt
					}).then(notifyRes => {
						cLogger.say(notifyRes);
					}).catch(notifyError => {
						cLogger.debug(notifyError);
					});
				}).catch(momentError => {
					cLogger.debug('Failed to get moment.');
				});
			}).catch(pgError => {
				next(pgError);
			});
			// return commentForMomentsHandler.updateVoteOfCommentForMoment(req.params.id, voteForComment).then(result => {
			// 	res.status(httpStatus.OK).send(result);
			// }).catch(error => {
			// 	next(error);
			// });

		}).catch(error => {
			next(error);
		});

	}

}