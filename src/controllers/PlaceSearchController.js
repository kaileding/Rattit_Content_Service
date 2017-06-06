/*
* @Author: KaileDing
* @Date:   2017-06-02 00:52:53
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-05 23:49:05
*/

'use strict';
import httpStatus from 'http-status'
import placeRequestValidator from '../helpers/PlaceRequestValidator'
import CLogger from '../helpers/CustomLogger'
import consts from '../config/Constants'
import searchHandler from '../handlers/SearchHandler'
let cLogger = new CLogger();

module.exports = {
	nearbySearch: function(req, res, next) {
		placeRequestValidator.validatePlaceSearchRequest(req);
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
		placeRequestValidator.validatePlaceSearchRequest(req);
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
	},

	getPlaceDetails: function(req, res, next) {
		req.checkParams('id', 'Invalid value of `id` in URL parameter').notEmpty();
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
	            		searchType: consts.PLACE_DETAILS_TYPE,
	            		placeId: req.params.id
	            	}).then(function(result) {
	            		res.status(httpStatus.OK).send(result);
	            	}).catch(err => {
	            		next(err);
	            	})
	            }
		});
	}
}