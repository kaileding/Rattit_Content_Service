/*
* @Author: KaileDing
* @Date:   2017-06-05 23:29:03
* @Last Modified by:   kaileding
* @Last Modified time: 2017-07-04 00:15:36
*/

'use strict';
import customValidations from './CustomValidations'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();

module.exports = {
	validateCreateUserRequest: function(req) {
		req.checkBody({
			'username': {
				optional: false,
				isLength: {
					options: [{ min: 3, max: 32 }],
					errorMessage: 'Must be between 3 and 32 chars long' // Error message for the validator, takes precedent over parameter message 
				},
				errorMessage: 'Invalid username'
			},
			'first_name': {
				optional: false,
				isLength: {
					options: [{ min: 3, max: 32 }],
					errorMessage: 'Must be between 3 and 32 chars long' // Error message for the validator, takes precedent over parameter message 
				},
				errorMessage: 'Invalid first_name'
			},
			'last_name': {
				optional: false,
				isLength: {
					options: [{ min: 3, max: 32 }],
					errorMessage: 'Must be between 3 and 32 chars long' // Error message for the validator, takes precedent over parameter message 
				},
				errorMessage: 'Invalid last_name'
			},
			'email': {
				optional: false,
				notEmpty: true,
				isEmail: {
					errorMessage: 'Invalid Email'
				}
			}, 
			'manifesto': {
				optional: true,
				isText: {
					errorMessage: 'Invalid manifesto'
				}
			},
			'organization': {
				optional: true,
				isArray: {
					errorMessage: 'organization should be array'
				}
			},
			'avatar': {
				optional: true,
				isWebURL: {
					errorMessage: 'Invalid avatar image url'
				}
			}
		});

		req.checkBody('gender', 'Missing gender').notEmpty();
		req.checkBody('gender', 'Missing gender').isOneOfStrings(['male', 'female', 'untold']);

	    return customValidations.validationResult(req);
	},

	validateGetUserByIdRequest: function(req) {
		req.checkParams('id', 'Invalid value of `id` in the brackets of URL').notEmpty();
		req.checkParams('id', 'Invalid value of `id` in the brackets of URL').isUUIDFormat();

	    return customValidations.validationResult(req);
	},


	validateGetRelationshipsOfUserRequest: function(req) {
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
			}
		});
		
	    return customValidations.validationResult(req);
	},

	validateGetUserByTextRequest: function(req) {
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
			}
		});

	    return customValidations.validationResult(req);
	},

	validateUpdateUserRequest: function(req) {
		req.checkParams('id', 'Invalid value of `id` in the brackets of URL').notEmpty();
		req.checkParams('id', 'Invalid value of `id` in the brackets of URL').isUUIDFormat();
		req.checkBody({
			'username': {
				optional: true,
				isLength: {
					options: [{ min: 3, max: 32 }],
					errorMessage: 'Must be between 3 and 32 chars long' // Error message for the validator, takes precedent over parameter message 
				},
				errorMessage: 'Invalid username'
			},
			'manifesto': {
				optional: true,
				isText: {
					errorMessage: 'Invalid manifesto'
				}
			},
			'organization': {
				optional: true,
				isArray: {
					errorMessage: 'organization should be array'
				}
			},
			'avatar': {
				optional: true,
				isWebURL: {
					errorMessage: 'Invalid avatar image url'
				}
			}
		});
		
	    return customValidations.validationResult(req);
	},

	validateFollowUsersRequest: function(req) {
		req.checkParams('id', 'Invalid value of `id` in the brackets of URL').notEmpty();
		req.checkParams('id', 'Invalid value of `id` in the brackets of URL').isUUIDFormat();
		req.checkBody({
			'followees': {
				optional: false,
				notEmpty: true,
				isArray: {
					errorMessage: 'followees should be an array of user_ids'
				}
			}
		});

		return customValidations.validationResult(req);
	},

	validateUnfollowUserRequest: function(req) {
		req.checkParams('id', 'Invalid value of `id` in the brackets of URL').notEmpty();
		req.checkParams('id', 'Invalid value of `id` in the brackets of URL').isUUIDFormat();
		req.checkParams('followee_id', 'Invalid value of `followee_id` in the brackets of URL').notEmpty();
		req.checkParams('followee_id', 'Invalid value of `followee_id` in the brackets of URL').isUUIDFormat();

		return customValidations.validationResult(req);
	}
}
