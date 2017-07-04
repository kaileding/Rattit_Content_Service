/*
* @Author: KaileDing
* @Date:   2017-06-12 01:55:36
* @Last Modified by:   kaileding
* @Last Modified time: 2017-07-04 00:01:08
*/

'use strict';
import customValidations from './CustomValidations'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();

module.exports = {
	validateCreateCommentRequest: function(req) {

		req.checkBody({
			'for_moment': {
				optional: false,
				notEmpty: true,
				isUUIDFormat: {
					errorMessage: 'for_moment should be an ID and in UUIDV1 format'
				},
				errorMessage: 'Invalid for_moment'
			},
			'for_comment': {
				optional: false,
				isUUIDFormatOrNull: {
					errorMessage: 'for_comment should be either null or an ID and in UUIDV1 format'
				},
				errorMessage: 'Invalid for_comment'
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
				isArray: {
					errorMessage: 'Photos should be an array'
				},
				errorMessage: 'Invalid photos'
			},
			'hash_tags': {
				optional: true,
				isArray: {
					errorMessage: 'Hash_tags should be an array'
				},
				errorMessage: 'Invalid hash_tags'
			}
		});

	    return customValidations.validationResult(req);
	},

	validateGetCommentByIdRequest: function(req) {
		req.checkParams('id', 'Invalid value of `id` in the brackets of URL').notEmpty();
		req.checkParams('id', 'Invalid value of `id` in the brackets of URL').isUUIDFormat();

	    return customValidations.validationResult(req);
	},

	validateGetCommentsByQueryRequest: function(req) {
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
			'for_moment': {
				optional: true,
				isUUIDFormat: {
					errorMessage: 'Query for_moment should be an ID and in UUIDV1 format'
				}
			},
			'for_comment': {
				optional: true,
				isUUIDFormatOrNull: {
					errorMessage: 'Query for_comment should be either null or an ID and in UUIDV1 format'
				}
			},
			'text': {
				optional: true,
				isText: {
					errorMessage: 'Query text must be a string'
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
					options: [['like', 'dislike']],
					errorMessage: 'voted_type should be one of ["like", "dislike"]'
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

	validateVoteForACommentRequest: function(req) {
		req.checkParams('id', 'Invalid value of `id` in the brackets of URL').notEmpty();
		req.checkParams('id', 'Invalid value of `id` in the brackets of URL').isUUIDFormat();
		req.checkParams('voterId', 'Invalid value of `voterId` in the brackets of URL').notEmpty();
		req.checkParams('voterId', 'Invalid value of `voterId` in the brackets of URL').isUUIDFormat();
		req.checkBody({
			'type': {
				optional: false,
				notEmpty: true,
				isOneOfStrings: {
					options: [['like', 'dislike']],
					errorMessage: 'type should be one of ["like", "dislike"]'
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