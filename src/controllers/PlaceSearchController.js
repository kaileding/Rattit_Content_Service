/*
* @Author: KaileDing
* @Date:   2017-06-02 00:52:53
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-02 00:58:41
*/

'use strict';
import httpStatus from 'http-status'
import requestValidator from '../helpers/RequestValidator'
import CLogger from '../helpers/CustomLogger'
import consts from '../config/Constants'
import searchHandler from '../handlers/SearchHandler'
let cLogger = new CLogger();

module.exports = {
	nearbySearch: function(req, res, next) {
		requestValidator.validatePlaceSearchRequest(req);
		req.getValidationResult().then(result => {
	            if (!result.isEmpty()) {
	            	cLogger.say(cLogger.TESTING_TYPE, 'At least one error.');
	                res.status(httpStatus.BAD_REQUEST).send({
	                	message: 'request validation failed.',
	                	error: result.array()
	                });
	            } else {
	            	cLogger.say(cLogger.TESTING_TYPE, 'validation passed.');


	            	searchHandler({
	            		searchType: consts.NEARBY_SEARCH_TYPE,
	            		latitude: req.query.lat,
	            		longitude: req.query.lon,
	            		rankByDistance: true,
	            		radius: req.query.radius,
	            		keyWord: req.query.keyword,
	            		typeName: req.query.typename,
	            		pageToken: req.query.pagetoken
	            	}).then(function(results) {
	            		res.status(httpStatus.OK).send(results);
	            	}).catch(err => {
	            		next(err);
	            	})           	
	            }
	        });
	},

	textSearch: function(req, res, next) {
		requestValidator.validatePlaceSearchRequest(req);
		req.getValidationResult().then(result => {
	            if (!result.isEmpty()) {
	            	cLogger.say(cLogger.TESTING_TYPE, 'At least one error.');
	                res.status(httpStatus.BAD_REQUEST).send({
	                	message: 'request validation failed.',
	                	error: result.array()
	                });
	            } else {
	            	cLogger.say(cLogger.TESTING_TYPE, 'validation passed.');


	            	searchHandler({
	            		searchType: consts.TEXT_SEARCH_TYPE,
	            		queryString: req.query.query,
	            		latitude: req.query.lat,
	            		longitude: req.query.lon,
	            		radius: req.query.radius,
	            		typeName: req.query.typename,
	            		pageToken: req.query.pagetoken
	            	}).then(function(results) {
	            		res.status(httpStatus.OK).send(results);
	            	}).catch(err => {
	            		next(err);
	            	})           	
	            }
	        });
	}
}