/*
* @Author: KaileDing
* @Date:   2017-06-12 01:51:30
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-12 20:26:45
*/

'use strict';
import httpStatus from 'http-status'
import Promise from 'bluebird'
import commentForMomentRequestValidator from '../Validators/CommentForMomentRequestValidator'
import CommentForMomentsHandler from '../handlers/CommentForMomentsHandler'
import models from '../models/Model_Index'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();
let commentForMomentsHandler = new CommentForMomentsHandler();

module.exports = {
	postCommentForAMoment: function(req, res, next) {
		commentForMomentRequestValidator.validateCreateCommentRequest(req).then(result => {

			return commentForMomentsHandler.createEntryForModel({
					for_moment: req.body.for_moment,
					for_comment: req.body.for_comment,
					words: req.body.words,
					photos: req.body.photos,
					hash_tags: req.body.hash_tags,
					createdBy: req.user_id
				}).then(result => {
	                cLogger.say(cLogger.TESTING_TYPE, 'save one comment for moment successfully.', result);
	                res.status(httpStatus.OK).send(result);
				}).catch(error => {
					next(error);
				});

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
            	for_moment: req.query.for_moment,
            	for_comment: req.query.for_comment,
                text: req.query.text,
                author_id: req.query.author_id,
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
		commentForMomentRequestValidator.validateVoteForACommentRequest(req).then(result => {

			let voteForComment = {
				vote_type: req.body.type,
				voted_by: req.params.voterId,
				commit: req.body.commit
			};

			return commentForMomentsHandler.updateVoteOfCommentForMoment(req.params.id, voteForComment).then(result => {
				res.status(httpStatus.OK).send(result);
			}).catch(error => {
				next(error);
			});

		}).catch(error => {
			next(error);
		});

	}

}