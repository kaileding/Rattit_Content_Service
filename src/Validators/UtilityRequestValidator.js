/*
* @Author: KaileDing
* @Date:   2017-06-19 20:40:59
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-19 22:00:49
*/

'use strict';
import customValidations from './CustomValidations'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();

module.exports = {
	validateGetS3SignedURLRequest: function(req) {
		req.checkQuery({
			'filename': {
				optional: false,
				notEmpty: true,
				isText: {
					errorMessage: 'Query filename must be text'
				}, 
				errorMessage: 'Invalid filename'
			},
			'filetype': {
				optional: false,
				notEmpty: true,
				isText: {
					errorMessage: 'Query filetype must be text'
				},
				errorMessage: 'Invalid filetype'
			}
		});

		return customValidations.validationResult(req);
	}

}