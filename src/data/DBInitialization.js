/*
* @Author: KaileDing
* @Date:   2017-06-09 22:11:13
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-11 02:14:07
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
		// Create Users
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
			organization: ["Umich", "California"],
			avatar: "https://s3-us-west-1.amazonaws.com/kaile-bucket-1/cross-hammers.png"
		}),
		models.Users.create({
			id: "baddc2ca-4e6b-11e7-b114-b2f933d5fe66",
			username: "pollyliuu",
			email: "pplliu@sample.com",
			first_name: "Polly",
			last_name: "Liu",
			gender: "male",
			manifesto: "Good good study!",
			organization: ["Bicycle club"],
			avatar: "https://s3-us-west-1.amazonaws.com/kaile-bucket-1/cross-hammers.png"
		}),
		models.Users.create({
			id: "d839cf08-4e6b-11e7-b114-b2f933d5fe66",
			username: "kittytitit",
			email: "ktttt@sample.com",
			first_name: "Kitty",
			last_name: "Tang",
			gender: "female",
			manifesto: "Day day up from bed",
			organization: ["SWE", "youngsters", "CMU"],
			avatar: "https://s3-us-west-1.amazonaws.com/kaile-bucket-1/cross-hammers.png"
		}),
		// Create Locations
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
		}),
		// Create Moments
		models.Moments.create({
			id: "113ebbde-4e84-11e7-b114-b2f933d5fe66",
			title: "Viva la vida",
			words: "I used to rule the world\nSeas would rise when I gave the word\nNow in the morning I sleep alone\nSweep the streets I used to own\n\nI used to roll the dice\nFeel the fear in my enemy's eyes\nListened as the crowd would sing\nNow the old king is dead long live the king\nOne minute I held the key\nNext the walls were closed on me\nAnd I discovered that my castles stand\nUpon pillars of salt and pillars of sand\n\nI hear Jerusalem bells a-ringing\nRoman cavalry choirs are singing\nBe my mirror, my sword and shield\nMy missionaries in a foreign field\nFor some reason I can't explain\nOnce you'd gone there was never\nNever an honest word\nAnd that was when I ruled the world\n\n\n",
			photos: [{
				image_url: "https://s3-us-west-1.amazonaws.com/kaile-bucket-1/house.jpg",
				height: 680,
				width: 1024
			}],
			hash_tags: ["Music", "The song that I cannot forget"],
			attachment: "https://play.google.com/music/preview/Tottpiypjkymc33yopkzdcynhwi?lyrics=1&utm_source=google&utm_medium=search&utm_campaign=lyrics&pcampaignid=kp-lyrics&u=0#",
			access_level: "followers",
			together_with: [
				"d839cf08-4e6b-11e7-b114-b2f933d5fe66"
			],
			createdBy: "e5b89946-4db4-11e7-b114-b2f933d5fe66"
		})
	];

	return dbConnectionPool.Promise.all(insertDataTasks).then(function(results) {
		console.log('Load test data successfully!');
		return "Success";
	}).catch(function(error) {
    	throw error;
    });
}