/*
* @Author: KaileDing
* @Date:   2017-06-09 21:29:15
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-09 22:28:39
*/

'use strict';

module.exports = function(req, res, next) {
	const api_path = req.originalUrl.split('?')[0];

	if (process.env.NODE_ENV === 'development'
		|| process.env.NODE_ENV === 'test') {

		req.user_id = req.headers['user_id'] || '2a13d930-4d91-11e7-b893-c108bf29bfb3';
		req.user_role = req.headers['user_role'] || 'unknown_user_role';
		next();
	} else {

		req.user_id = req.headers['user_id'] || '2a13d930-4d91-11e7-b893-c108bf29bfb3';
		req.user_role = req.headers['user_role'] || 'unknown_user_role';
		next();
	}

}
