/*
* @Author: KaileDing
* @Date:   2017-05-29 10:47:08
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-10 02:16:13
*/

'use strict';
import Promise from 'bluebird'
import httpStatus from 'http-status'
import APIError from '../helpers/APIError'
import isUUID from 'is-uuid'
import urlChecker from 'valid-url'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();

module.exports = {
    customValidators: {
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
                return (urlChecker.isWebUri(value) != undefined);
            },
            isGeoCoordinates: function(value) {
                if (value.longitude && value.latitude) {
                    return ((typeof value.longitude === 'number') 
                        && (typeof value.latitude === 'number'));
                }
                return false;
            },
            greaterThanOrEqualTo: function(value, number) {
                return value >= number;
            },
            isNumber: function(value) {
                return typeof value === 'number';
            }
        }
    },

    validationResult: function(req) {
        return new Promise((resolve, reject) => {
                req.getValidationResult().then(result => {
                    if (!result.isEmpty()) {
                        reject(new APIError('request validation failed.', httpStatus.BAD_REQUEST, result.array()));

                    } else {
                        resolve("Pass Validator");
                    }
                });
            });
    }

};
