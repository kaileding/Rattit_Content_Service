/*
* @Author: KaileDing
* @Date:   2017-06-07 23:44:28
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-21 19:49:48
*/

'use strict';
import customValidations from './CustomValidations'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();

module.exports = {
	validateCreateLocationRequest: function(req) {
		req.checkBody({
			'coordinates': {
				optional: false,
				notEmpty: true,
				isGeoCoordinates: {
					errorMessage: 'Invalid coordinates'
				},
				errorMessage: 'Invalid coordinates'
			},
			'name': {
				optional: false,
				notEmpty: true,
				isText: {
					errorMessage: 'Invalid name'
				},
				errorMessage: 'Invalid name'
			},
			'icon_url': {
				optional: true,
				isWebURL: {
					errorMessage: 'Invalid icon image url'
				},
				errorMessage: 'Invalid icon image url'
			},
			'types': {
				optional: true,
				isArray: {
					errorMessage: 'types should be array'
				}
			}, 
			'google_place_id': {
				optional: true,
				notEmpty: false,
				isText: {
					errorMessage: 'Invalid google_place_id'
				}
			}
		});

	    return customValidations.validationResult(req);
	},

	validateGetLocationsRequest: function(req) {
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
			'lon': {
				optional: true,
				isNumber: {
					errorMessage: 'Query lon must be a number'
				}
			},
			'lat': {
				optional: true,
				isNumber: {
					errorMessage: 'Query lat must be a number'
				}
			},
			'distance': {
				optional: true,
				isNumber: {
					errorMessage: 'Query distance must be a number'
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

	validateGetLocationByIdRequest: function(req) {
		req.checkParams('id', 'Invalid value of `id` in the brackets of URL').notEmpty();
		req.checkParams('id', 'Invalid value of `id` in the brackets of URL').isUUIDFormat();

	    return customValidations.validationResult(req);
	},

	validateUpdateLocationRequest: function(req) {
		req.checkParams('id', 'Invalid value of `id` in the brackets of URL').notEmpty();
		req.checkParams('id', 'Invalid value of `id` in the brackets of URL').isUUIDFormat();
		req.checkBody({
			'coordinates': {
				optional: true,
				isGeoCoordinates: {
					errorMessage: 'Invalid coordinates'
				},
				errorMessage: 'Invalid coordinates'
			},
			'name': {
				optional: true,
				isText: {
					errorMessage: 'Invalid name'
				},
				errorMessage: 'Invalid name'
			},
			'icon_url': {
				optional: true,
				isWebURL: {
					errorMessage: 'Invalid icon image url'
				},
				errorMessage: 'Invalid icon image url'
			},
			'types': {
				optional: true,
				isArray: {
					errorMessage: 'types should be array'
				}
			},
			'google_place_id': {
				optional: true,
				notEmpty: false,
				isText: {
					errorMessage: 'Invalid google_place_id'
				}
			}
		});
		
	    return customValidations.validationResult(req);
	}
}
