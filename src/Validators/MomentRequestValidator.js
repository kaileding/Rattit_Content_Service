/*
* @Author: KaileDing
* @Date:   2017-06-11 01:18:33
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-11 01:54:16
*/

'use strict';
import customValidations from './CustomValidations'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();

module.exports = {
	validateCreateMomentRequest: function(req) {

		req.checkBody({
			'title': {
				optional: false,
				notEmpty: true,
				isText: {
					errorMessage: 'Title should be text'
				},
				errorMessage: 'Invalid title'
			},
			'words': {
				optional: false,
				notEmpty: true,
				isText: {
					errorMessage: 'Words should be text'
				},
				errorMessage: 'Invalid words'
			},
			'photos': {
				optional: true,
				notEmpty: false,
				isArray: {
					errorMessage: 'Photos should be an array'
				},
				errorMessage: 'Invalid photos'
			},
			'hash_tags': {
				optional: true,
				notEmpty: false,
				isArray: {
					errorMessage: 'Hash_tags should be an array'
				},
				errorMessage: 'Invalid hash_tags'
			},
			'attachment': {
				optional: true,
				notEmpty: false,
				isWebURL: {
					errorMessage: 'Attachment should be a web URL'
				},
				errorMessage: 'Invalid attachment'
			},
			'location_id': {
				optional: true,
				notEmpty: false,
				isUUIDFormat: {
					errorMessage: 'Attachment should be an ID and in UUIDV1 format'
				},
				errorMessage: 'Invalid location_id'
			},
			'access_level': {
				optional: true,
				notEmpty: false,
				isOneOfStrings: {
					options: [['self', 'followers', 'public']],
					errorMessage: 'Access_level should be one of ["self", "followers", "public"]'
				},
				errorMessage: 'Invalid access_level'
			},
			'together_with': {
				optional: true,
				notEmpty: false,
				isArray: {
					errorMessage: 'Together_with should be an array'
				},
				errorMessage: 'Invalid together_with'
			}
			// 'likedBy': {
			// 	optional: true,
			// 	notEmpty: false,
			// 	isArray: {
			// 		errorMessage: 'LikedBy should be an array'
			// 	},
			// 	errorMessage: 'Invalid likedBy'
			// },
			// 'appreciatedBy': {
			// 	optional: true,
			// 	notEmpty: false,
			// 	isArray: {
			// 		errorMessage: 'AppreciatedBy should be an array'
			// 	},
			// 	errorMessage: 'Invalid appreciatedBy'
			// },
		});

	    return customValidations.validationResult(req);
	}
}