/*
* @Author: KaileDing
* @Date:   2017-06-10 23:03:06
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-11 02:25:49
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
					likedBy: [],
					appreciatedBy: [],
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

	updateMoment: function(req, res, next) {
		res.status(httpStatus.OK).send('OK');

	},

	likeAMoment: function(req, res, next) {
		res.status(httpStatus.OK).send('OK');

	},

	notLikeAMoment: function(req, res, next) {
		res.status(httpStatus.OK).send('OK');

	},

	appreciateAMoment: function(req, res, next) {
		res.status(httpStatus.OK).send('OK');

	},

	notAppreciateAMoment: function(req, res, next) {
		res.status(httpStatus.OK).send('OK');
		
	}
}