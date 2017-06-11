/*
* @Author: KaileDing
* @Date:   2017-06-10 23:03:06
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-11 16:52:42
*/

'use strict';
import httpStatus from 'http-status'
import Promise from 'bluebird'
import momentRequestValidator from '../Validators/MomentRequestValidator'
import MomentsHandler from '../handlers/MomentsHandler'
import models from '../models/Model_Index'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();
let momentsHandler = new MomentsHandler();

module.exports = {
	postMoment: function(req, res, next) {
		momentRequestValidator.validateCreateMomentRequest(req).then(result => {

			return momentsHandler.createEntryForModel({
					title: req.body.title,
					words: req.body.words,
					photos: req.body.photos,
					hash_tags: req.body.hash_tags,
					attachment: req.body.attachment,
					location_id: req.body.location_id,
					access_level: req.body.access_level,
					together_with: (req.body.together_with || []),
					createdBy: req.user_id
				}).then(result => {
	                cLogger.say(cLogger.TESTING_TYPE, 'save one moment successfully.', result);
	                res.status(httpStatus.OK).send(result);
				}).catch(error => {
					next(error);
				});

		}).catch(error => {
			next(error);
		})
	},

	getMomentById: function(req, res, next) {
		momentRequestValidator.validateGetMomentByIdRequest(req).then(result => {

			return momentsHandler.findEntryByIdFromModel(req.params.id).then(result => {
                    res.status(httpStatus.OK).send(result);
                }).catch(err => {
                    next(err);
                });

		}).catch(error => {
			next(error);
		});
	},

	getMomentsByQuery: function(req, res, next) {
		momentRequestValidator.validateGetMomentsByQueryRequest(req).then(result => {

            var queryObj = {
                text: req.query.text,
                location_id: req.query.location_id,
                author_id: req.query.author_id,
                limit: req.query.limit,
                offset: req.query.offset,
                joinWithVotes: false
            };
            if (req.query.voted_type && req.query.voted_by) {
            	queryObj.joinWithVotes = true;
            	queryObj.voted_type = req.query.voted_type;
            	queryObj.voted_by = req.query.voted_by;
            }

            return momentsHandler.findMomentsByQuery(queryObj)
                        .then(function(results) {
                            res.status(httpStatus.OK).send(results);
                        }).catch(function(error) {
                            next(error);
                        });

		}).catch(error => {
			next(error);
		})
	},

	updateMoment: function(req, res, next) {
		momentRequestValidator.validateUpdateMomentRequest(req).then(result => {

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
            if (req.body.together_with) {
                updateObj.together_with = req.body.together_with;
            }

            return momentsHandler.updateEntryByIdForModel(req.params.id, updateObj).then(result => {
            	res.status(httpStatus.OK).send(result);
            }).catch(error => {
            	next(error);
            });

		}).catch(error => {
			next(error);
		});
	},

	deleteMoment: function(req, res, next) {
		momentRequestValidator.validateGetMomentByIdRequest(req).then(result => {

			return momentsHandler.deleteEntryByIdFromModel(req.params.id).then(result => {
				res.status(httpStatus.OK).send(result);
			}).catch(error => {
				next(error);
			});

		}).catch(error => {
			next(error);
		});
	},

	castOrChangeVoteForMoment: function(req, res, next) {
		momentRequestValidator.validateVoteForAMomentRequest(req).then(result => {

			return momentsHandler.
			// res.status(httpStatus.OK).send("OK");

		}).catch(error => {
			next(error);
		});

	}

}