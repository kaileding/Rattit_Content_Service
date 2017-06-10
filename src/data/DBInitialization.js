/*
* @Author: KaileDing
* @Date:   2017-06-09 22:11:13
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-09 22:32:05
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
			id: "2a13d930-4d91-11e7-b893-c108bf29bfb3",
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
			id: "1962c9fc-3723-41c3-88b7-b8e59886e042",
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
    		loc_point: {
    			type: 'Point',
				coordinates: [37.5538989, -122.3001194],
				crs: { type: 'name', properties: { name: 'EPSG:4326'} }
    		},
    		name: "Central San Mateo - ATM (U.S. Bank)",
    		icon: "https://s3-us-west-1.amazonaws.com/kaile-bucket-1/cross-hammers.png",
    		types: ["bank", "machine"],
    		google_place_id: "23bc8338a0d35ea5e129a01ed998b4ec856607b1",
    		createdBy: "2a13d930-4d91-11e7-b893-c108bf29bfb3",
    		updatedBy: "2a13d930-4d91-11e7-b893-c108bf29bfb3"
		}),
		models.Locations.create({
    		loc_point: {
    			type: 'Point',
				coordinates: [37.55586, -122.292897],
				crs: { type: 'name', properties: { name: 'EPSG:4326'} }
    		},
    		name: "Fish Market Restaurant",
    		icon: "https://s3-us-west-1.amazonaws.com/kaile-bucket-1/cross-hammers.png",
    		types: ["food", "chinese"],
    		google_place_id: "4613a012d26d9adcad933706d6bbc877f5861078",
    		createdBy: "2a13d930-4d91-11e7-b893-c108bf29bfb3",
    		updatedBy: "2a13d930-4d91-11e7-b893-c108bf29bfb3"
		})
	];

	return dbConnectionPool.Promise.all(insertDataTasks).then(function(results) {
		console.log('Load test data successfully!');
		return "Success";
	}).catch(function(error) {
    	throw error;
    });
}