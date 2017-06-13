/*
* @Author: KaileDing
* @Date:   2017-06-09 22:11:13
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-12 17:51:53
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

let getInsertUsersTask = function() {
	return [
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
			organization: ["Bicycle Club"],
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
			organization: ["SWE", "Youngsters", "CMU"],
			avatar: "https://s3-us-west-1.amazonaws.com/kaile-bucket-1/cross-hammers.png"
		})
	];
}

let getInsertLocationsTask = function() {
	return [
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
	];
}

let getInsertMomentsTask = function() {
	return [
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
			hash_tags: ["music", "the song that i cannot forget"],
			attachment: "https://play.google.com/music/preview/Tottpiypjkymc33yopkzdcynhwi?lyrics=1&utm_source=google&utm_medium=search&utm_campaign=lyrics&pcampaignid=kp-lyrics&u=0#",
			location_id: "101a04cc-4db5-11e7-b114-b2f933d5fe66",
			access_level: "followers",
			together_with: [
				"d839cf08-4e6b-11e7-b114-b2f933d5fe66"
			],
			createdBy: "e5b89946-4db4-11e7-b114-b2f933d5fe66"
		}),
		models.Moments.create({
			id: "18fbc402-4ef7-11e7-b114-b2f933d5fe66",
			title: "Adventure of a Lifetime",
			words: "Turn your magic on, to me she'd say Everything you want's a dream away We are legends, every day That's what she told him I feel my heart beating I feel my heart beneath my skin I feel my heart beating Oh, you make me feel Like I'm alive again Alive again Oh, you make me feel Like I'm alive again Said I can't go on, not in this way I'm a dream, I die by light of day Gonna hold up half the sky and say Only I own me I feel my heart beating I feel my heart beneath my skin Oh, I can feel my heart beating 'Cause you make me feel Like I'm alive again Alive again Oh, you make me feel Like I'm alive again Turn your magic on, to me she'd say Everything you want's a dream away Under this pressure, under this weight We are diamonds taking shape We are diamonds taking shape (Woo hoo, woo hoo) If we've only got this life This adventure oh then I If we've only got this life You'll get me through, oh If we've only got this life And this adventure, oh then I Wanna share it with you With you, with you Sing it, oh, say yeah! Woo hoo (woo hoo)",
			photos: [{
				image_url: "https://s3-us-west-1.amazonaws.com/kaile-bucket-1/house.jpg",
				height: 680,
				width: 1024
			}],
			hash_tags: ["music", "coldplay", "english", "rock"],
			attachment: "https://play.google.com/music/preview/Tgu5bk5yikgomjis4566552fanu?lyrics=1&utm_source=google&utm_medium=search&utm_campaign=lyrics&pcampaignid=kp-lyrics&u=0#",
			access_level: "followers",
			together_with: [
				"d839cf08-4e6b-11e7-b114-b2f933d5fe66"
			],
			createdBy: "04a9e6b6-4db5-11e7-b114-b2f933d5fe66"
		})
	];
}

let getInsertQuestionsTask = function() {
	return [
		// Create Questions
		models.Questions.create({
			id: "94f3c042-4f37-11e7-b114-b2f933d5fe66",
			title: "Can Google be beaten?",
			words: "\nLike the title states.\n\n",
			photos: [{
				image_url: "https://s3-us-west-1.amazonaws.com/kaile-bucket-1/house.jpg",
				height: 680,
				width: 1024
			}],
			hash_tags: [
				"Google",
				"Technology",
				"Competition"
			],
			attachment: "https://www.quora.com/Can-Google-be-beaten",
			location_id: "101a04cc-4db5-11e7-b114-b2f933d5fe66",
			access_level: "followers",
			createdBy: "04a9e6b6-4db5-11e7-b114-b2f933d5fe66"
		}),
		models.Questions.create({
			id: "9e1ea1be-4f37-11e7-b114-b2f933d5fe66",
			title: "How do they make actors/actresses look so good?",
			words: "Often times I see actors or actresses before they were famous and they don’t look at all like they do when they’re on screen or out in public. What kind of techniques do they use to make them look so good?\n\n",
			photos: [{
				image_url: "https://s3-us-west-1.amazonaws.com/kaile-bucket-1/house.jpg",
				height: 680,
				width: 1024
			}],
			hash_tags: [
				"Performance",
				"Appearance"
			],
			attachment: "https://www.quora.com/How-do-they-make-actors-actresses-look-so-good",
			access_level: "followers",
			createdBy: "04a9e6b6-4db5-11e7-b114-b2f933d5fe66"
		})
	];
}

let getInsertAnswersTask = function() {
	return [
		// Create Answers
		models.Answers.create({
			id: "c3b9862c-4f42-11e7-b114-b2f933d5fe66",
			for_question: "94f3c042-4f37-11e7-b114-b2f933d5fe66",
			words: "Google can easily be beaten. It doesn’t take much for someone like Apple, Mozilla, or Microsoft to shut out Google and replace it with Bing. That’s why Google constantly has to throw massive resources at preventing it. That’s (one of the many reasons) why Google had to develop Chrome, to prevent the other browsers from blocking Google. That’s why Google had to go through the trouble of developing a major phone OS, Android, to prevent being shut out of that market. That’s why Google spends a lot of time with open standards committees, to prevent more proprietary solutions from gumming up the market. At any point, the Trump government could do great damage to Google, or any other company that appears ungrateful to him.\n\nSo, yeah, it’s a constant battle just to stay alive.",
			photos: [{
				image_url: "https://s3-us-west-1.amazonaws.com/kaile-bucket-1/house.jpg",
				height: 680,
				width: 1024
			}],
			hash_tags: [
				"11K likes",
				"Brief"
			],
			attachment: "https://www.quora.com/profile/Bruce-R-Miller",
			createdBy: "e5b89946-4db4-11e7-b114-b2f933d5fe66"
		}),
		models.Answers.create({
			id: "66f53dae-4f43-11e7-b114-b2f933d5fe66",
			for_question: "94f3c042-4f37-11e7-b114-b2f933d5fe66",
			words: "Not in coming Two to Three Decades. Because Google keeping up on its momentum of R & D for newer and better products also buying new and innovative ventures. They are heavily investing on startup’s and trying to build a start up ecosystem which will feed them with result in future. But, if we see the quantum of investment they lost in few of their major almost dead products, few still live like Google Plus and few more (Check the Google Graveyard) these affected a lot on income generation strength of many Google Products.\n\nDue to heavy pressure on google to deliver from its platform it need to spend monumental amount running its almost unthinkable infrastructure. Still for years it has delivered quite well and i would say they now rule in 3 segments, they are:\n\n1. Search\n2. Mobile\n3. Browser\n\n",
			photos: [{
				image_url: "https://s3-us-west-1.amazonaws.com/kaile-bucket-1/house.jpg",
				height: 680,
				width: 1024
			}],
			hash_tags: [
				"Many photos",
				"20 Votes"
			],
			attachment: "https://arstechnica.com/business/2016/05/firefox-overtakes-microsoft-internet-explorer-edge-browsers-first-time-statcounter/",
			createdBy: "04a9e6b6-4db5-11e7-b114-b2f933d5fe66"
		})
	];
}

let getInsertCommentsTask_1 = function() {
	return [
		// Create CommentsForMoment
		models.CommentsForMoment.create({
			id: "d5afd0b0-4fb1-11e7-b114-b2f933d5fe66",
			for_moment: "113ebbde-4e84-11e7-b114-b2f933d5fe66",
			for_comment: null,
			words: "Wen ru gou.",
			photos: [{
				image_url: "https://s3-us-west-1.amazonaws.com/kaile-bucket-1/house.jpg",
				height: 680,
				width: 1024
			}],
			hash_tags: [
				"666"
			],
			createdBy: "e5b89946-4db4-11e7-b114-b2f933d5fe66"
		}),
		// Create CommentsForAnswer
		models.CommentsForAnswer.create({
			id: "d02e5204-4fd1-11e7-b114-b2f933d5fe66",
			for_answer: "c3b9862c-4f42-11e7-b114-b2f933d5fe66",
			for_comment: null,
			words: "Saying words without paying money.",
			createdBy: "e5b89946-4db4-11e7-b114-b2f933d5fe66"
		})
	];
}

let getInsertCommentsTask_2 = function() {
	return [
		// Create CommentsForMoment
		models.CommentsForMoment.create({
			id: "2169bb38-4fb2-11e7-86a1-b2f933d5fe66",
			for_moment: "113ebbde-4e84-11e7-b114-b2f933d5fe66",
			for_comment: "d5afd0b0-4fb1-11e7-b114-b2f933d5fe66",
			words: "Are you kidding?",
			photos: [{
				image_url: "https://s3-us-west-1.amazonaws.com/kaile-bucket-1/house.jpg",
				height: 680,
				width: 1024
			}],
			hash_tags: [
				"666"
			],
			createdBy: "04a9e6b6-4db5-11e7-b114-b2f933d5fe66"
		}),
		// Create CommentsForAnswer
		models.CommentsForAnswer.create({
			id: "478d942c-4fd2-11e7-b114-b2f933d5fe66",
			for_answer: "c3b9862c-4f42-11e7-b114-b2f933d5fe66",
			for_comment: "d02e5204-4fd1-11e7-b114-b2f933d5fe66",
			words: "Good idea plus hard work and a little bit of fortune will make it.",
			createdBy: "04a9e6b6-4db5-11e7-b114-b2f933d5fe66"
		})
	]
}

module.exports = function() {


	return dbConnectionPool.Promise.all(getInsertUsersTask()).then(function(results) {
		return dbConnectionPool.Promise.all(getInsertLocationsTask()).then(function(results) {
			return dbConnectionPool.Promise.all(getInsertMomentsTask()).then(function(results) {
				return dbConnectionPool.Promise.all(getInsertQuestionsTask()).then(function(results) {
					return dbConnectionPool.Promise.all(getInsertAnswersTask()).then(function(results) {
						return dbConnectionPool.Promise.all(getInsertCommentsTask_1()).then(function(results) {
							return dbConnectionPool.Promise.all(getInsertCommentsTask_2()).then(function(results) {
								console.log('Load test data successfully!');
								return "Success";
							}).catch(function(error) {
								throw error;
							});
						}).catch(function(error) {
							throw error;
						});
					}).catch(function(error) {
						throw error;
					});
				}).catch(function(error) {
					throw error;
				});
			}).catch(function(error) {
				throw error;
			});
		}).catch(function(error) {
			throw error;
		});
	}).catch(function(error) {
    	throw error;
    });
}
