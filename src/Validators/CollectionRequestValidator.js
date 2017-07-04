/*
* @Author: KaileDing
* @Date:   2017-06-13 02:03:41
* @Last Modified by:   kaileding
* @Last Modified time: 2017-07-03 23:58:15
*/

'use strict';
import customValidations from './CustomValidations'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();

module.exports = {
	validateCreateCollectionRequest: function(req) {

		req.checkBody({
			'title': {
				optional: false,
				notEmpty: true,
				isText: {
					errorMessage: 'title should be text'
				},
				errorMessage: 'Invalid title'
			},
			'description': {
				optional: false,
				notEmpty: true,
				isText: {
					errorMessage: 'description should be text'
				},
				errorMessage: 'Invalid description'
			},
			'cover_image': {
				optional: true,
				isWebURL: {
					errorMessage: 'cover_image should be a web URL'
				},
				errorMessage: 'Invalid cover_image'
			},
			'tags': {
				optional: true,
				isArray: {
					errorMessage: 'tags should be an array'
				},
				errorMessage: 'Invalid tags'
			},
			'access_level': {
				optional: true,
				notEmpty: true,
				isOneOfStrings: {
					options: [['self', 'friends', 'followers', 'public']],
					errorMessage: 'Access_level should be one of ["self", "friends", "followers", "public"]'
				},
				errorMessage: 'Invalid access_level'
			}
		});

	    return customValidations.validationResult(req);
	},

	validateUpdateCollectionRequest: function(req) {
		req.checkParams('id', 'Invalid value of `id` in the brackets of URL').notEmpty();
		req.checkParams('id', 'Invalid value of `id` in the brackets of URL').isUUIDFormat();

		req.checkBody({
			'title': {
				optional: true,
				notEmpty: true,
				isText: {
					errorMessage: 'title should be text'
				},
				errorMessage: 'Invalid title'
			},
			'description': {
				optional: true,
				notEmpty: true,
				isText: {
					errorMessage: 'description should be text'
				},
				errorMessage: 'Invalid description'
			},
			'cover_image': {
				optional: true,
				isWebURL: {
					errorMessage: 'cover_image should be a web URL'
				},
				errorMessage: 'Invalid cover_image'
			},
			'tags': {
				optional: true,
				isArray: {
					errorMessage: 'tags should be an array'
				},
				errorMessage: 'Invalid tags'
			},
			'access_level': {
				optional: true,
				notEmpty: true,
				isOneOfStrings: {
					options: [['self', 'friends', 'followers', 'public']],
					errorMessage: 'Access_level should be one of ["self", "friends", "followers", "public"]'
				},
				errorMessage: 'Invalid access_level'
			}
		});

	    return customValidations.validationResult(req);
	},

	validateGetCollectionByIdRequest: function(req) {
		req.checkParams('id', 'Invalid value of `id` in the brackets of URL').notEmpty();
		req.checkParams('id', 'Invalid value of `id` in the brackets of URL').isUUIDFormat();

	    return customValidations.validationResult(req);
	},

	validateGetCollectionsByQueryRequest: function(req) {
		req.checkQuery({
			'limit': {
				optional: true,
				isInt: {
					errorMessage: 'Query limit must be an integer'
				},
				greaterThanOrEqualTo: {
					options: [1],
					errorMessage: 'Query limit must be greater than or equal to 1'
				}
			},
			'offset': {
				optional: true,
				isInt: {
					errorMessage: 'Query offset must be an integer'
				},
				greaterThanOrEqualTo: {
					options: [1],
					errorMessage: 'Query offset must be greater than or equal to 1'
				}
			},
			'date_query_type': {
				optional: true,
				isOneOfStrings: {
					options:[['noearlier_than', 'nolater_than']],
					errorMessage: 'Query date_query_type should be one of ["noearlier_than", "nolater_than"]'
				}
			},
			'date_query_line': {
				optional: true,
				isUTCTimeStamp: {
					errorMessage: 'Query date_query_line should be in UTC Timestamp format.'
				}
			},
			'text': {
				optional: true,
				isText: {
					errorMessage: 'Query text must be a string'
				}
			},
			'owner_id': {
				optional: true,
				isUUIDFormat: {
					errorMessage: 'Query owner_id should be an ID and in UUIDV1 format'
				}
			},
			'question_id': {
				optional: true,
				isUUIDFormat: {
					errorMessage: 'Query question_id should be an ID and in UUIDV1 format'
				}
			},
			'answer_id': {
				optional: true,
				isUUIDFormat: {
					errorMessage: 'Query answer_id should be an ID and in UUIDV1 format'
				}
			},
			'moment_id': {
				optional: true,
				isUUIDFormat: {
					errorMessage: 'Query moment_id should be an ID and in UUIDV1 format'
				}
			}
		});

		return customValidations.validationResult(req);
	},

	validateAddContentToCollectionRequest: function(req) {
		req.checkParams('id', 'Invalid value of `id` in the brackets of URL').notEmpty();
		req.checkParams('id', 'Invalid value of `id` in the brackets of URL').isUUIDFormat();

		req.checkBody({
			'contentId': {
				optional: false,
				notEmpty: true,
				isUUIDFormat: {
					errorMessage: 'contentId should be an ID and in UUIDV1 format'
				},
				errorMessage: 'Invalid contentId value'
			}
		});

	    return customValidations.validationResult(req);
	},

	validateRemoveContentFromCollectionRequest: function(req) {
		req.checkParams('id', 'Invalid value of `id` in the brackets of URL').notEmpty();
		req.checkParams('id', 'Invalid value of `id` in the brackets of URL').isUUIDFormat();
		req.checkParams('contentId', 'Invalid value of `contentId` in the brackets of URL').notEmpty();
		req.checkParams('contentId', 'Invalid value of `contentId` in the brackets of URL').isUUIDFormat();

		return customValidations.validationResult(req);
	}

}