/*
* @Author: KaileDing
* @Date:   2017-06-07 18:27:01
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-10 02:31:42
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
		locationRequestValidator.validateCreateLocationRequest(req).then(result => {

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

        }).catch(error => {
            next(error);
        });
	},

	getLocationsByQuery: function(req, res, next) {
		locationRequestValidator.validateGetLocationsRequest(req).then(result => {

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

        }).catch(error => {
            next(error);
        });
	},

	getLocationById: function(req, res, next) {
		locationRequestValidator.validateGetLocationByIdRequest(req).then(result => {

            return locationsHandler.findLocationById(req.params.id).then(result => {
                    res.status(httpStatus.OK).send(result);
                }).catch(err => {
                    next(err);
                });

        }).catch(error => {
            next(error);
        });
	},

	updateLocation: function(req, res, next) {
		locationRequestValidator.validateUpdateLocationRequest(req).then(result => {

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
                });

        }).catch(error => {
            next(error);
        });
	},

	deleteLocation: function(req, res, next) {
		locationRequestValidator.validateGetLocationByIdRequest(req).then(result => {
            
            return locationsHandler.deleteLocationById(req.params.id).then(result => {
                    res.status(httpStatus.OK).send(result);
                }).catch(err => {
                    next(err);
                });

        }).catch(error => {
            next(error);
        });
	}
}