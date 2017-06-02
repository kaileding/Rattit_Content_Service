/*
* @Author: KaileDing
* @Date:   2017-05-29 10:47:08
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-02 00:58:25
*/

'use strict';
import CLogger from './CustomLogger'
let cLogger = new CLogger();

var requestValidator = {};

requestValidator.customValidators = {
	customValidators: {
        isArray: function(value) {
            return Array.isArray(value);
        },
        eachIsPresent: function(values, prop) {
            return values.every(function(val) {
                return val.hasOwnProperty(prop);
            });
        },
        getByIdParamCorrect: function(value) {
        	if (value == null) {
        		return false;
        	}
            // the param value must be something with a brackets
            if (value[0] != '(' 
                || value[value.length-1] != ')' 
                || value === '()') {
                return false;
            }
            const idVal = Number(value.substring(1,value.length-1));
            // content within the brackets must be a number
            if (isNaN(idVal)) {
                return false;
            }
            // the number must be an integer
            if (idVal % 1 !== 0) {
                return false;
            }
            return true;
        }
    }
};

requestValidator.validatePlaceSearchRequest = function(req) {
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


module.exports = requestValidator;
