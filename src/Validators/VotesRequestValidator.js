/*
 * @Author: Kaile Ding 
 * @Date: 2017-08-06 16:16:58 
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-06 16:40:22
 */

'use strict';
import customValidations from './CustomValidations'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();

module.exports = {
    validateGetVotesForAnswersByQueryRequest: function(req) {
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
            },
            'answer_id': {
                optional: true,
                isUUIDFormat: {
                    errorMessage: 'Query answer_id should be an ID and in UUIDV1 format'
                }
            }
		});

		return customValidations.validationResult(req);
    },

    validateGetVotesForQuestionsByQueryRequest: function(req) {
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
					options: [['interest', 'invite', 'pity']],
					errorMessage: 'vote_type should be one of ["interest", "invite", "pity"]'
				}
			},
			'voter_id': {
				optional: true,
				isUUIDFormat: {
					errorMessage: 'Query voter_id should be an ID and in UUIDV1 format'
				}
            },
            'question_id': {
                optional: true,
                isUUIDFormat: {
                    errorMessage: 'Query question_id should be an ID and in UUIDV1 format'
                }
            }
		});

		return customValidations.validationResult(req);
    },

    validateGetVotesForMomentsByQueryRequest: function(req) {
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
					options: [['like', 'admire', 'pity']],
					errorMessage: 'vote_type should be one of ["like", "admire", "pity"]'
				}
			},
			'voter_id': {
				optional: true,
				isUUIDFormat: {
					errorMessage: 'Query voter_id should be an ID and in UUIDV1 format'
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
    }

}