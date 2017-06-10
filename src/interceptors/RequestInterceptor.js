/*
* @Author: KaileDing
* @Date:   2017-06-09 21:29:15
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-10 02:36:15
*/

'use strict';

module.exports = function(req, res, next) {
	const api_path = req.originalUrl.split('?')[0];

	if (process.env.NODE_ENV === 'development'
		|| process.env.NODE_ENV === 'test') {

		req.user_id = req.headers['user_id'] || 'e5b89946-4db4-11e7-b114-b2f933d5fe66';
		req.user_role = req.headers['user_role'] || 'unknown_user_role';
		next();
	} else {

		req.user_id = req.headers['user_id'] || 'e5b89946-4db4-11e7-b114-b2f933d5fe66';
		req.user_role = req.headers['user_role'] || 'unknown_user_role';
		next();
	}

}
