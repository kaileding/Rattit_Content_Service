/*
* @Author: KaileDing
* @Date:   2017-05-29 10:44:11
* @Last Modified by:   kaileding
* @Last Modified time: 2017-05-31 00:48:34
*/

'use strict';
import httpStatus from 'http-status'

/**
 * @extends Error
 */
class ExtendableError extends Error {
    constructor(message, status, isPublic) {
        super(message);

        this.name = this.constructor.name;
        this.message = message;
        this.status = status;
        this.isPublic = isPublic;
        this.isOperational = true; // This is required since bluebird 4 doesn't append it anymore.
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

/**
 * Class representing an API error.
 * @extends ExtendableError
 */
class APIError extends ExtendableError {
    /**
    * Creates an API error.
    * @param {string} message - Error message.
    * @param {number} status - HTTP status code of error.
    * @param {boolean} isPublic - Whether the message should be visible to user or not.
    */
    constructor(message, status = httpStatus.INTERNAL_SERVER_ERROR, isPublic = false) {
        super(message, status, isPublic);
    }

    // don't understand why not a function.
    getFormattedJson() {
        let tempInfo = {
            'code': this.status,
            'message': this.message,
            'info': {}
        };
        console.log('xxxx error:\n', tempInfo);
        return tempInfo;
    }
}

module.exports = APIError;
