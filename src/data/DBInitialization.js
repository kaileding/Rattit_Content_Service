/*
* @Author: KaileDing
* @Date:   2017-06-09 22:11:13
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-10 16:22:03
*/

'use strict';
import Promise from 'bluebird'
import dbConnectionPool from '../data/DBConnection'
import models from '../models/Model_Index'
import httpStatus from 'http-status'
import APIError from '../helpers/APIError'
import CLogger from '../helpers/CustomLogger'
import consts from '../config/Constants'
let cLogger = new CLogger();

module.exports = function() {
	var insertDataTasks = [
		models.Users.create({
			id: "e5b89946-4db4-11e7-b114-b2f933d5fe66",
			username: "leilililili",
			email: "leili@sample.com",
			first_name: "Lei",
			last_name: "Li",
			gender: "male",
			manifesto: "Be happy!",
			organization: ["Umich"],
			avatar: "https://s3-us-west-1.amazonaws.com/kaile-bucket-1/cross-hammers.png"
		}),
		models.Users.create({
			id: "04a9e6b6-4db5-11e7-b114-b2f933d5fe66",
			username: "hanmeimei",
			email: "meimeih@sample.com",
			first_name: "Meimei",
			last_name: "Han",
			gender: "female",
			manifesto: "Be happier!",
			organization: ["Umich"],
			avatar: "https://s3-us-west-1.amazonaws.com/kaile-bucket-1/cross-hammers.png"
		}),
		models.Locations.create({
			id: "101a04cc-4db5-11e7-b114-b2f933d5fe66",
    		loc_point: {
    			type: 'Point',
				coordinates: [37.5538989, -122.3001194],
				crs: { type: 'name', properties: { name: 'EPSG:4326'} }
    		},
    		name: "Central San Mateo - ATM (U.S. Bank)",
    		icon: "https://s3-us-west-1.amazonaws.com/kaile-bucket-1/cross-hammers.png",
    		types: ["bank", "machine"],
    		google_place_id: "23bc8338a0d35ea5e129a01ed998b4ec856607b1",
    		createdBy: "e5b89946-4db4-11e7-b114-b2f933d5fe66",
    		updatedBy: "e5b89946-4db4-11e7-b114-b2f933d5fe66"
		}),
		models.Locations.create({
			id: "191a4da2-4db5-11e7-b114-b2f933d5fe66",
    		loc_point: {
    			type: 'Point',
				coordinates: [37.566901, -122.282897],
				crs: { type: 'name', properties: { name: 'EPSG:4326'} }
    		},
    		name: "Fish Market Restaurant",
    		icon: "https://s3-us-west-1.amazonaws.com/kaile-bucket-1/cross-hammers.png",
    		types: ["food", "chinese"],
    		google_place_id: "4613a012d26d9adcad933706d6bbc877f5861078",
    		createdBy: "e5b89946-4db4-11e7-b114-b2f933d5fe66",
    		updatedBy: "e5b89946-4db4-11e7-b114-b2f933d5fe66"
		})
	];

	return dbConnectionPool.Promise.all(insertDataTasks).then(function(results) {
		console.log('Load test data successfully!');
		return "Success";
	}).catch(function(error) {
    	throw error;
    });
}