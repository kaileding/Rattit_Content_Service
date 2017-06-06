/*
* @Author: KaileDing
* @Date:   2017-05-29 10:47:08
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-06 00:36:58
*/

'use strict';
import isUUID from 'is-uuid'
import urlChecker from 'valid-url'
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
        },
        isOneOfStrings: function(value, enums) {
            if (value == null) {
                return true;
            }
            return enums.includes(value);
        },
        isUUIDFormat: function(value) {
            if (value == null || typeof value != 'string') {
                return false;
            }
            return isUUID.v1(value);
        },
        isText: function(value) {
            return (typeof value === 'string');
        },
        isWebURL: function(value) {
            return (urlChecker.isWebUri(value) != null);
        }
    }
};

module.exports = requestValidator;
