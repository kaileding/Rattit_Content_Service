/*
* @Author: KaileDing
* @Date:   2017-06-05 23:29:03
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-10 02:18:30
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
				notEmpty: false,
				isText: {
					errorMessage: 'Invalid manifesto'
				}
			},
			'organization': {
				optional: true,
				notEmpty: false,
				isArray: {
					errorMessage: 'organization should be array'
				}
			},
			'avatar': {
				optional: true,
				notEmpty: false,
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
				notEmpty: false,
				isText: {
					errorMessage: 'Invalid manifesto'
				}
			},
			'organization': {
				optional: true,
				notEmpty: false,
				isArray: {
					errorMessage: 'organization should be array'
				}
			},
			'avatar': {
				optional: true,
				notEmpty: false,
				isWebURL: {
					errorMessage: 'Invalid avatar image url'
				}
			}
		});
		
	    return customValidations.validationResult(req);
	}
}
