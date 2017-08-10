/*
* @Author: KaileDing
* @Date:   2017-06-05 23:45:50
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-10 01:12:11
*/

'use strict';
import customValidations from './CustomValidations'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();

module.exports = {
	validatePlaceSearchRequest: function(req) {
	    if (req.query.pagetoken != null && req.query.pagetoken.length > 100) {
	        cLogger.say('request has pagetoken.');
	    } else if (req.query.query != null) {
	        cLogger.say('request has text query.');
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
