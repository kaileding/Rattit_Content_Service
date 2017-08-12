/*
 * @Author: Kaile Ding 
 * @Date: 2017-08-11 21:35:28 
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-11 21:40:39
 */

'use strict';
import customValidations from './CustomValidations'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();

module.exports = {
    validateGetContentFeedRequest: function(req) {
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
    }
}