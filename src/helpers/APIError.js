/*
* @Author: KaileDing
* @Date:   2017-05-29 10:44:11
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-10 00:29:27
*/

'use strict';
import httpStatus from 'http-status'
import CLogger from './CustomLogger'
let cLogger = new CLogger();

module.exports = function APIError(message, statusCode = httpStatus.INTERNAL_SERVER_ERROR, errObj = {}) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
    this.statusCode = statusCode;
    this.errObj = errObj;

    cLogger.say(cLogger.ESSENTIAL_TYPE, this);

    this.getFormattedJson = function() {

        let tempInfo = {
            'code': this.statusCode,
            'message': this.message,
            'info': this.errObj
        };
        
        return tempInfo;
    }
};

require('util').inherits(module.exports, Error);
