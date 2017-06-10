/*
* @Author: KaileDing
* @Date:   2017-06-08 00:37:54
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-10 03:03:35
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
// let locationDataHandler = new DataModelHandler(models.Locations);
let cLogger = new CLogger();

class LocationsHandler extends DataModelHandler {
	constructor() {
		super(models.Locations);
	}

	findLocations(filterOjb) {
		return new Promise((resolve, reject) => {
			let model = this.model;
			model.findAll({
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

		// findLocationsByText: function(text) {
	// 	let queryByName = findLocations({
	// 		name: {
	// 			ilike: '%'+text+'%'
	// 		}
	// 	});
	// 	let queryByType = findLocations({
	// 		types: {
	// 			$contains: {
	// 				'%'+text+'%' // Not sure
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

}



module.exports = LocationsHandler;
