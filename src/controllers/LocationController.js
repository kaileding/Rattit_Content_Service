/*
* @Author: KaileDing
* @Date:   2017-06-07 18:27:01
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-10 01:03:26
*/

'use strict';
import httpStatus from 'http-status'
import Promise from 'bluebird'
import locationRequestValidator from '../Validators/LocationRequestValidator'
import locationsHandler from '../handlers/LocationsHandler'
import models from '../models/Model_Index'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();

module.exports = {
	createLocation: function(req, res, next) {
		locationRequestValidator.validateCreateLocationRequest(req);
		req.getValidationResult().then(result => {
            if (!result.isEmpty()) {
            	cLogger.say(cLogger.TESTING_TYPE, 'At least one error.');
                res.status(httpStatus.BAD_REQUEST).send({
                	message: 'request validation failed.',
                	error: result.array()
                });
            } else {
            	cLogger.say(cLogger.TESTING_TYPE, 'validation passed.');

            	return locationsHandler.createLocation({
            		loc_point: {
            			type: 'Point',
						coordinates: [req.body.coordinates.latitude, req.body.coordinates.longitude],
						crs: { type: 'name', properties: { name: 'EPSG:4326'} }
            		},
            		name: req.body.name,
            		icon: req.body.icon_url,
            		types: req.body.types,
            		google_place_id: req.body.google_place_id,
            		createdBy: req.user_id,
            		updatedBy: req.user_id
				}).then(function(result) {
					cLogger.say(cLogger.TESTING_TYPE, 'save one location successfully.', result);
					res.status(httpStatus.OK).send(result);
				}).catch(function(error) {
			    	next(error);
			    });
            }
        });
	},

	getLocationsByQuery: function(req, res, next) {
		locationRequestValidator.validateGetLocationsRequest(req);
		req.getValidationResult().then(result => {
            if (!result.isEmpty()) {
            	cLogger.say(cLogger.TESTING_TYPE, 'At least one error.');
                res.status(httpStatus.BAD_REQUEST).send({
                	message: 'request validation failed.',
                	error: result.array()
                });
            } else {
            	cLogger.say(cLogger.TESTING_TYPE, 'validation passed.');

                // get with query: limit, lon, lat, text
                // This function should be well implemented
                // To be finish later!

                /*
                    if (req.query.text) {
                        return locationsHandler.findLocationsByText(req.query.limit).then(function(results) {
                            cLogger.say(cLogger.TESTING_TYPE, 'get locations successfully.', results);
                            res.status(httpStatus.OK).send(results);
                        }).catch(function(error) {
                            next(error);
                        });
                    } else {
                        return locationsHandler.findAllLocations(req.query.limit).then(function(results) {
                            cLogger.say(cLogger.TESTING_TYPE, 'get locations successfully.', results);
                            res.status(httpStatus.OK).send(results);
                        }).catch(function(error) {
                            next(error);
                        });
                    }
                */


            	return locationsHandler.findAllLocations(req.query.limit).then(function(results) {
					cLogger.say(cLogger.TESTING_TYPE, 'get locations successfully.', results);
					res.status(httpStatus.OK).send(results);
				}).catch(function(error) {
			    	next(error);
			    });
            }
        });
	},

	getLocationById: function(req, res, next) {
		locationRequestValidator.validateGetLocationByIdRequest(req);
		req.getValidationResult().then(result => {
            if (!result.isEmpty()) {
            	cLogger.say(cLogger.TESTING_TYPE, 'At least one error.');
                res.status(httpStatus.BAD_REQUEST).send({
                	message: 'request validation failed.',
                	error: result.array()
                });
            } else {
            	cLogger.say(cLogger.TESTING_TYPE, 'validation passed.');

            	return locationsHandler.findLocationById(req.params.id).then(result => {
                    res.status(httpStatus.OK).send(result);
                }).catch(err => {
                    next(err);
                });
            }
        });
	},

	// getLocationByQuery: function(req, res, next) {
 //        cLogger.say(cLogger.TESTING_TYPE, 'req.query.text is ', req.query.text);
 //        if (req.query.text === null || req.query.text === undefined) {
 //            cLogger.say(cLogger.TESTING_TYPE, 'get all users.');

 //            return usersHandler.findAllUsers().then((results) => {
 //                    res.status(httpStatus.OK).send(results);
 //                }).catch(function(error) {
 //                    next(error);
 //                });
 //        } else if (typeof req.query.text === 'string') {
 //            cLogger.say(cLogger.TESTING_TYPE, 'validation passed.');

 //                return usersHandler.findUserByText(req.query.text).then((results) => {
 //                    res.status(httpStatus.OK).send(results);
 //                }).catch(function(error) {
 //                    next(error);
 //                });
 //        } else {
 //            cLogger.say(cLogger.TESTING_TYPE, 'At least one error.');
 //            res.status(httpStatus.BAD_REQUEST).send({
 //                message: 'request validation failed.',
 //                error: 'text in query is not string.'
 //            });
 //        }
	// },

	updateLocation: function(req, res, next) {
		locationRequestValidator.validateUpdateLocationRequest(req);
		req.getValidationResult().then(result => {
            if (!result.isEmpty()) {
            	cLogger.say(cLogger.TESTING_TYPE, 'At least one error.');
                res.status(httpStatus.BAD_REQUEST).send({
                	message: 'request validation failed.',
                	error: result.array()
                });
            } else {
            	cLogger.say(cLogger.TESTING_TYPE, 'validation passed.');

            	var updateObj = {};
                if (req.body.coordinates) {
                    updateObj.loc_point = {
            			type: 'Point',
						coordinates: [req.body.coordinates.latitude, req.body.coordinates.longitude],
						crs: { type: 'name', properties: { name: 'EPSG:4326'} }
            		};
                }
            	if (req.body.name) {
            		updateObj.name = req.body.name;
            	}
            	if (req.body.icon_url) {
            		updateObj.icon_url = req.body.icon_url;
            	}
            	if (req.body.types) {
            		updateObj.types = req.body.types;
            	}
            	if (req.body.google_place_id) {
            		updateObj.google_place_id = req.body.google_place_id;
            	}

            	return locationsHandler.updateLocationById(req.params.id, updateObj).then(result => {
                    res.status(httpStatus.OK).send(result);
                }).catch(err => {
                    next(err);
                })
            }
        });
	},

	deleteLocation: function(req, res, next) {
		locationRequestValidator.validateGetLocationByIdRequest(req);
		req.getValidationResult().then(result => {
            if (!result.isEmpty()) {
            	cLogger.say(cLogger.TESTING_TYPE, 'At least one error.');
                res.status(httpStatus.BAD_REQUEST).send({
                	message: 'request validation failed.',
                	error: result.array()
                });
            } else {
            	cLogger.say(cLogger.TESTING_TYPE, 'validation passed.');

            	return locationsHandler.deleteLocationById(req.params.id).then(result => {
                    res.status(httpStatus.OK).send(result);
                }).catch(err => {
                    next(err);
                });
            }
        });
	}
}