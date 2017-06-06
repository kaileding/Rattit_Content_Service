/*
* @Author: KaileDing
* @Date:   2017-06-05 23:45:50
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-05 23:46:39
*/

'use strict';
import requestValidator from './RequestValidator'
import CLogger from './CustomLogger'
let cLogger = new CLogger();

module.exports = {
	validatePlaceSearchRequest: function(req) {
		// req.checkBody('name', 'Missing name').isArray().notEmpty();
	    if (req.query.pagetoken != null && req.query.pagetoken.length > 100) {
	        cLogger.say(cLogger.TESTING_TYPE, 'request has pagetoken.');
	    } else if (req.query.query != null) {
	        cLogger.say(cLogger.TESTING_TYPE, 'request has text query.');
	    } else {
	        req.checkQuery('lon', 'Missing lon value.').notEmpty();
	        req.checkQuery('lat', 'Missing lat value.').notEmpty();
	    }
	    
	 //    req.checkParams('id', 'Invalid value of `id` in the brackets of URL').notEmpty();
		// req.checkParams('id', 'Invalid value of `id` in the brackets of URL').getByIdParamCorrect();
	}
}
