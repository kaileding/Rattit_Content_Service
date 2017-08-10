/*
* @Author: KaileDing
* @Date:   2017-06-07 18:27:01
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-10 01:02:57
*/

'use strict';
import httpStatus from 'http-status'
import Promise from 'bluebird'
import locationRequestValidator from '../Validators/LocationRequestValidator'
import LocationsHandler from '../handlers/LocationsHandler'
import models from '../models/Model_Index'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();
let locationsHandler = new LocationsHandler();

module.exports = {
	createLocation: function(req, res, next) {
		locationRequestValidator.validateCreateLocationRequest(req).then(result => {

            return locationsHandler.createEntryForModel({
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
                    cLogger.debug('save one location successfully.', result);
                    res.status(httpStatus.CREATED).send(result);
                }).catch(function(error) {
                    next(error);
                });

        }).catch(error => {
            next(error);
        });
	},

	getLocationsByQuery: function(req, res, next) {
		locationRequestValidator.validateGetLocationsRequest(req).then(result => {
            
            let queryObj = {
                text: req.query.text,
                coordinates: {
                    longitude: Number(req.query.lon),
                    latitude: Number(req.query.lat)
                },
                distance: Number(req.query.distance),
                queryDateType: req.query.date_query_type,
                dateLine: req.query.date_query_line,
                limit: req.query.limit,
                offset: req.query.offset
            };

            return locationsHandler.findLocationsByQuery(queryObj)
                        .then(function(results) {
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

            return locationsHandler.findEntryByIdFromModel(req.params.id).then(result => {
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

            return locationsHandler.updateEntryByIdForModel(req.params.id, updateObj).then(result => {
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
            
            return locationsHandler.deleteEntryByIdFromModel(req.params.id).then(result => {
                    res.status(httpStatus.OK).send(result);
                }).catch(err => {
                    next(err);
                });

        }).catch(error => {
            next(error);
        });
	}
}