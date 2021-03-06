/*
* @Author: KaileDing
* @Date:   2017-06-05 23:45:50
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-10 02:22:17
*/

'use strict';
import customValidations from './CustomValidations'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();

module.exports = {
	validatePlaceSearchRequest: function(req) {
	    if (req.query.pagetoken != null && req.query.pagetoken.length > 100) {
	        cLogger.say(cLogger.TESTING_TYPE, 'request has pagetoken.');
	    } else if (req.query.query != null) {
	        cLogger.say(cLogger.TESTING_TYPE, 'request has text query.');
	    } else {
	        req.checkQuery('lon', 'Missing lon value.').notEmpty();
	        req.checkQuery('lat', 'Missing lat value.').notEmpty();
	    }

	    return customValidations.validationResult(req);
	},

	validatePlaceDetailSearchRequest: function(req) {
		req.checkParams('id', 'Invalid value of `id` in URL parameter').notEmpty();
		
	    return customValidations.validationResult(req);
	}
}
