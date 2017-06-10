/*
* @Author: KaileDing
* @Date:   2017-06-08 00:37:54
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-10 00:44:36
*/

'use strict';
import Promise from 'bluebird'
import models from '../models/Model_Index'
import DataModelHandler from './DataModelHandler'
import rp from 'request-promise'
import httpStatus from 'http-status'
import APIError from '../helpers/APIError'
import CLogger from '../helpers/CustomLogger'
import consts from '../config/Constants'
let locationDataHandler = new DataModelHandler(models.Locations);
let cLogger = new CLogger();

let findLocations = function(filterOjb) {
	return new Promise((resolve, reject) => {
			models.Locations.findAll({
                where: filterOjb,
                order: [['createdAt', 'DESC']]
            }).then(function(results) {
                cLogger.say(cLogger.TESTING_TYPE, 'fetched results are', results);
                resolve(results);
            }).catch(function(error) {
                reject(error);
            });
		});
}

module.exports = {
	createLocation: function(locationObj) {
		return locationDataHandler.createEntryForModel(locationObj);
	},

	findAllLocations: function(number = 20) {
		return locationDataHandler.findEntriesFromModel(number);
	},

	// findLocationsByText: function(text) {
	// 	let queryByName = findLocations({
	// 		name: {
	// 			ilike: '%'+text+'%'
	// 		}
	// 	});
	// 	let queryByType = findLocations({
	// 		types: {
	// 			$contains: {
	// 				'%'+text+'%'
	// 			}
 //            }
	// 	});

	// 	return Promise.all([queryByName, queryByType]).then((results) => {
 //                    var combinedRes = results[0];
 //                    combinedRes = combinedRes.concat(results[1]);
 //                    cLogger.say(cLogger.TESTING_TYPE, 'get '+combinedRes.length+' locations successfully.');
 //                    return combinedRes;
 //                }).catch(function(error) {
 //                    throw error;
 //                });
	// },

	findLocationById: function(id) {
		return locationDataHandler.findEntryByIdFromModel(id);
	},

	updateLocationById: function(id, updateObj) {
		return locationDataHandler.updateEntryByIdForModel(id, updateObj);
	},

	deleteLocationById: function(id) {
		return locationDataHandler.deleteEntryByIdFromModel(id);
	}
}
