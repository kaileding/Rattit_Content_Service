/*
* @Author: KaileDing
* @Date:   2017-05-30 17:32:08
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-07 01:37:17
*/

'use strict';
import Promise from 'bluebird'
import rp from 'request-promise'
import httpStatus from 'http-status'
import APIError from '../helpers/APIError'
import CLogger from '../helpers/CustomLogger'
import consts from '../config/Constants'
let cLogger = new CLogger();

let nearbySearchUrlGen = function(searchObj) {
	var reqUrl = consts.NEARBY_SEARCH_BASE_URL + '?key=' + process.env.GOOGLE_API_KEY;
	reqUrl += '&language='+(searchObj.languageCode || 'en');

	if (searchObj.pageToken != null) {
		reqUrl += '&pagetoken='+searchObj.pageToken;
	}  else {
		reqUrl += '&location='+searchObj.latitude+','+searchObj.longitude;
		if (searchObj.rankByDistance) {
			reqUrl += '&rankby=distance';

			if (searchObj.keyWord == null && searchObj.typeName == null) {
				let errorMessage = 'rankby=distance needs to specify keyword or typename as well';
				throw new APIError(errorMessage, httpStatus.BAD_REQUEST, true);
			}
		} else {
			reqUrl += '&radius='+(searchObj.radius || '1000');
		}
		reqUrl += (searchObj.keyWord != null) ? '&keyword='+searchObj.keyWord : '';
		reqUrl += (searchObj.typeName != null) ? '&type='+searchObj.typeName : '';
	}

	return reqUrl;
}

let textSearchUrlGen = function(searchObj) {
	var reqUrl = consts.TEXT_SEARCH_BASE_URL + '?key=' + process.env.GOOGLE_API_KEY;
	reqUrl += '&language='+(searchObj.languageCode || 'en');

	if (searchObj.pageToken != null) {
		reqUrl += '&pagetoken='+searchObj.pageToken;
	}  else {
		reqUrl += '&query='+searchObj.queryString;
		if (searchObj.latitude && searchObj.longitude) {
			reqUrl += '&location='+searchObj.latitude+','+searchObj.longitude;
			reqUrl += '&radius='+(searchObj.radius || '1000');
		}
		reqUrl += (searchObj.typeName != null) ? '&type='+searchObj.typeName : '';
	}

	return reqUrl;
}

let placeDetailUrlGen = function(searchObj) {
	var reqUrl = consts.PLACE_DETAILS_URL + '?key=' + process.env.GOOGLE_API_KEY;
	reqUrl += '&language='+(searchObj.languageCode || 'en');
	reqUrl += '&placeid='+searchObj.placeId;

	return reqUrl;
}

module.exports = function(searchObj) {
	cLogger.say(cLogger.TESTING_TYPE, 'searchObj is', searchObj);

	return new Promise((resolve, reject)=> {

				try {
					var searchUrl = null;
					if (searchObj.searchType === consts.NEARBY_SEARCH_TYPE) {
						searchUrl = nearbySearchUrlGen(searchObj);
					} else if (searchObj.searchType === consts.TEXT_SEARCH_TYPE) {
						searchUrl = textSearchUrlGen(searchObj);
					} else if (searchObj.searchType === consts.PLACE_DETAILS_TYPE) {
						searchUrl = placeDetailUrlGen(searchObj);
					} else {
						let errorMessage = 'search type undefined.';
						reject(new APIError(errorMessage, httpStatus.BAD_REQUEST));
					}
					
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

