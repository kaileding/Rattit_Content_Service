/*
* @Author: KaileDing
* @Date:   2017-06-11 01:18:33
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-11 15:19:35
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
		});

	    return customValidations.validationResult(req);
	},

	validateUpdateMomentRequest: function(req) {
		req.checkParams('id', 'Invalid value of `id` in the brackets of URL').notEmpty();
		req.checkParams('id', 'Invalid value of `id` in the brackets of URL').isUUIDFormat();

		req.checkBody({
			'title': {
				optional: true,
				notEmpty: true,
				isText: {
					errorMessage: 'Title should be text'
				},
				errorMessage: 'Invalid title'
			},
			'words': {
				optional: true,
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
					errorMessage: 'location_id should be an ID and in UUIDV1 format'
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
		});

	    return customValidations.validationResult(req);
	},

	validateGetMomentByIdRequest: function(req) {
		req.checkParams('id', 'Invalid value of `id` in the brackets of URL').notEmpty();
		req.checkParams('id', 'Invalid value of `id` in the brackets of URL').isUUIDFormat();

	    return customValidations.validationResult(req);
	},

	validateGetMomentsByQueryRequest: function(req) {
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
			'text': {
				optional: true,
				isText: {
					errorMessage: 'Query text must be a string'
				}
			},
			'location_id': {
				optional: true,
				isUUIDFormat: {
					errorMessage: 'Query location_id should be an ID and in UUIDV1 format'
				}
			},
			'author_id': {
				optional: true,
				isUUIDFormat: {
					errorMessage: 'Query author_id should be an ID and in UUIDV1 format'
				}
			},
			'voted_type': {
				optional: true,
				isOneOfStrings: {
					options: [['like', 'admire', 'pity']],
					errorMessage: 'voted_type should be one of ["like", "admire", "pity"]'
				}
			},
			'voted_by': {
				optional: true,
				isUUIDFormat: {
					errorMessage: 'Query author_id should be an ID and in UUIDV1 format'
				}
			}
		});

		return customValidations.validationResult(req);
	},

	validateVoteForAMomentRequest: function(req) {
		req.checkParams('id', 'Invalid value of `id` in the brackets of URL').notEmpty();
		req.checkParams('id', 'Invalid value of `id` in the brackets of URL').isUUIDFormat();
		req.checkParams('voterId', 'Invalid value of `voterId` in the brackets of URL').notEmpty();
		req.checkParams('voterId', 'Invalid value of `voterId` in the brackets of URL').isUUIDFormat();
		req.checkBody({
			'type': {
				optional: false,
				notEmpty: true,
				isOneOfStrings: {
					options: [['like', 'admire', 'pity']],
					errorMessage: 'type should be one of ["like", "admire", "pity"]'
				},
				errorMessage: 'Invalid type value'
			},
			'commit': {
				optional: false,
				notEmpty: true,
				isBoolean: {
					errorMessage: 'commit should be a boolean'
				},
				errorMessage: 'Invalid commit value'
			}
		});

	    return customValidations.validationResult(req);
	}

}