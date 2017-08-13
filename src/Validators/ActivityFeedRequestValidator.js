/*
 * @Author: Kaile Ding 
 * @Date: 2017-08-11 21:35:28 
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-12 17:57:41
 */

'use strict';
import customValidations from './CustomValidations'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();

module.exports = {
    validateGetActivityFeedRequest: function(req) {
		req.checkQuery({
            'upto_time': {
                optional: true,
                isNumber: {
                    errorMessage: 'Query upto_time must be a number'
                },
                greaterThanOrEqualTo: {
                    options: [1],
                    errorMessage: 'Query upto_time must be greater than or equal to 1'
                }
            }
		});

		return customValidations.validationResult(req);
    },

    validateGetNotificationFeedRequest: function(req) {
		req.checkQuery({
            'upto_time': {
                optional: true,
                isNumber: {
                    errorMessage: 'Query upto_time must be a number'
                },
                greaterThanOrEqualTo: {
                    options: [1],
                    errorMessage: 'Query upto_time must be greater than or equal to 1'
                }
            },
            'all_unread': {
                optional: true,
                isBoolean: {
                    errorMessage: 'Query all_unread must be a boolean value'
                }
            }
		});

		return customValidations.validationResult(req);
    },

    validateMarkNotificationAsReadRequest: function(req) {
		req.checkQuery({
            'action_time': {
                optional: true,
                isNumber: {
                    errorMessage: 'Query upto_time must be a number'
                },
                greaterThanOrEqualTo: {
                    options: [1],
                    errorMessage: 'Query upto_time must be greater than or equal to 1'
                }
            },
            'all_unread': {
                optional: true,
                isBoolean: {
                    errorMessage: 'Query all_unread must be a boolean value'
                }
            }
		});

	    return customValidations.validationResult(req);
    }
}