/*
* @Author: KaileDing
* @Date:   2017-05-30 17:32:08
* @Last Modified by:   kaileding
* @Last Modified time: 2017-05-31 02:02:35
*/

'use strict';
import Promise from 'bluebird'
import rp from 'request-promise'
import httpStatus from 'http-status'
import APIError from '../helpers/APIError'
import CLogger from '../helpers/CustomLogger'
import consts from '../config/Constants'
let cLogger = new CLogger();

let searchUrlGen = function(searchObj) {
	cLogger.say(cLogger.TESTING_TYPE, 'searchObj is', searchObj);

	var reqUrl = consts.NEARBY_SEARCH_BASE_URL + '?key=' + process.env.GOOGLE_API_KEY;
	reqUrl += '&location='+searchObj.latitude+','+searchObj.longitude;
	reqUrl += '&language='+(searchObj.languageCode || 'en');
	if (searchObj.rankByDistance) {
		reqUrl += '&rankby=distance';

		if (searchObj.keyWord == null && searchObj.typeName == null) {
			let errorMessage = 'rankby=distance needs to specify keyword or typename as well';
			throw new APIError(errorMessage, httpStatus.BAD_REQUEST, true);
			// throw apiError;
		}
	} else {
		reqUrl += '&radius='+(searchObj.radius || '1000');
	}
	reqUrl += (searchObj.keyWord != null) ? '&keyword='+searchObj.keyWord : '';
	reqUrl += (searchObj.typeName != null) ? '&type='+searchObj.typeName : '';
	reqUrl += (searchObj.pageToken != null) ? '&pagetoken='+searchObj.pageToken : '';
	return reqUrl;
}

module.exports = function(searchObj) {

	return new Promise((resolve, reject)=> {

				try {
					let searchUrl = searchUrlGen(searchObj);
					let options = {
				        method: 'GET',
				        uri: searchUrl,
				        headers: {
				            'Content-type' : 'application/json'
				        },
				        json: true
					};

					rp(options)
	                .then(data => {
	                	cLogger.say(cLogger.TESTING_TYPE, 'response is', data);
	                    resolve(data);
	                }).catch(err => {
	                    reject(err);
	                });
				} catch (err) {
					reject(err);
				}
                
            });
}

