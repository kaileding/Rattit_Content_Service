/*
* @Author: KaileDing
* @Date:   2017-06-12 16:47:56
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-21 19:37:17
*/

'use strict';
import httpStatus from 'http-status'
import Promise from 'bluebird'
import commentForAnswerRequestValidator from '../Validators/CommentForAnswerRequestValidator'
import CommentForAnswersHandler from '../handlers/CommentForAnswersHandler'
import models from '../models/Model_Index'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();
let commentForAnswersHandler = new CommentForAnswersHandler();

module.exports = {
	postCommentForAnAnswer: function(req, res, next) {
		commentForAnswerRequestValidator.validateCreateCommentRequest(req).then(result => {

			return commentForAnswersHandler.createEntryForModel({
					for_answer: req.body.for_answer,
					for_comment: req.body.for_comment,
					words: req.body.words,
					createdBy: req.user_id
				}).then(result => {
	                cLogger.say(cLogger.TESTING_TYPE, 'save one comment for moment successfully.', result);
	                res.status(httpStatus.CREATED).send(result);
				}).catch(error => {
					next(error);
				});

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
		commentForAnswerRequestValidator.validateVoteForACommentRequest(req).then(result => {

			let voteForComment = {
				vote_type: req.body.type,
				voted_by: req.params.voterId,
				commit: req.body.commit
			};

			return commentForAnswersHandler.updateVoteOfCommentForMoment(req.params.id, voteForComment).then(result => {
				res.status(httpStatus.OK).send(result);
			}).catch(error => {
				next(error);
			});

		}).catch(error => {
			next(error);
		});

	}

}