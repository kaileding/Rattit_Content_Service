/*
* @Author: KaileDing
* @Date:   2017-06-11 23:54:39
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-21 19:48:46
*/

'use strict';
import customValidations from './CustomValidations'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();

module.exports = {
	validateCreateAnswerRequest: function(req) {

		req.checkBody({
			'for_question': {
				optional: false,
				notEmpty: true,
				isUUIDFormat: {
					errorMessage: 'For_question should be an ID and in UUIDV1 format'
				},
				errorMessage: 'Invalid for_question'
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
			}
		});

	    return customValidations.validationResult(req);
	},

	validateUpdateAnswerRequest: function(req) {
		req.checkParams('id', 'Invalid value of `id` in the brackets of URL').notEmpty();
		req.checkParams('id', 'Invalid value of `id` in the brackets of URL').isUUIDFormat();

		req.checkBody({
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
			}
		});

	    return customValidations.validationResult(req);
	},

	validateGetAnswerByIdRequest: function(req) {
		req.checkParams('id', 'Invalid value of `id` in the brackets of URL').notEmpty();
		req.checkParams('id', 'Invalid value of `id` in the brackets of URL').isUUIDFormat();

	    return customValidations.validationResult(req);
	},

	validateGetAnswersByQueryRequest: function(req) {
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
			'for_question': {
				optional: true,
				isUUIDFormat: {
					errorMessage: 'Query for_question should be an ID and in UUIDV1 format'
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
					options: [['agree', 'disagree', 'admire']],
					errorMessage: 'voted_type should be one of ["agree", "disagree", "admire"]'
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

	validateVoteForAnAnswerRequest: function(req) {
		req.checkParams('id', 'Invalid value of `id` in the brackets of URL').notEmpty();
		req.checkParams('id', 'Invalid value of `id` in the brackets of URL').isUUIDFormat();
		req.checkParams('voterId', 'Invalid value of `voterId` in the brackets of URL').notEmpty();
		req.checkParams('voterId', 'Invalid value of `voterId` in the brackets of URL').isUUIDFormat();
		req.checkBody({
			'type': {
				optional: false,
				notEmpty: true,
				isOneOfStrings: {
					options: [['agree', 'disagree', 'admire']],
					errorMessage: 'type should be one of ["agree", "disagree", "admire"]'
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
	},

	validateGetVotesForAnswerIdRequest: function(req) {
		req.checkParams('id', 'Invalid value of `id` in the brackets of URL').notEmpty();
		req.checkParams('id', 'Invalid value of `id` in the brackets of URL').isUUIDFormat();
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
			'vote_type': {
				optional: true,
				isOneOfStrings: {
					options: [['agree', 'disagree', 'admire']],
					errorMessage: 'vote_type should be one of ["agree", "disagree", "admire"]'
				}
			},
			'voter_id': {
				optional: true,
				isUUIDFormat: {
					errorMessage: 'Query voter_id should be an ID and in UUIDV1 format'
				}
			}
		});

		return customValidations.validationResult(req);
	}

}