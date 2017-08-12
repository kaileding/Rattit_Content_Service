/*
* @Author: KaileDing
* @Date:   2017-06-10 23:03:06
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-12 03:11:36
*/

'use strict';
import httpStatus from 'http-status'
import Promise from 'bluebird'
import consts from '../config/Constants'
import momentRequestValidator from '../Validators/MomentRequestValidator'
import MomentsHandler from '../handlers/MomentsHandler'
import VotesForMomentsHandler from '../handlers/VotesForMomentsHandler'
import LocationsHandler from '../handlers/LocationsHandler'
import UserRelationshipsHandler from '../handlers/UserRelationshipsHandler'
import DynamoFeedsHandler from '../handlers/DynamoFeedsHandler'
import DynamoActivitiesHandler from '../handlers/DynamoActivitiesHandler'
import DynamoHotPostsHandler from '../handlers/DynamoHotPostsHandler'
import DynamoNotificationsHandler from '../handlers/DynamoNotificationsHandler'
import models from '../models/Model_Index'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();
let momentsHandler = new MomentsHandler();
let votesForMomentsHandler = new VotesForMomentsHandler();
let locationsHandler = new LocationsHandler();
let userRelationshipsHandler = new UserRelationshipsHandler();
let feedsHandler = new DynamoFeedsHandler();
let activitiesHandler = new DynamoActivitiesHandler();
let hotPostsHandler = new DynamoHotPostsHandler();
let notificationsHandler = new DynamoNotificationsHandler();

let updateVotesNumberOfMoment = function(vote_type, moment_id) {
	return new Promise((resolve, reject) => {
			votesForMomentsHandler.countEntriesFromModelForFilter({
					vote_type: vote_type,
					moment_id: moment_id
				}).then(result => {

					var updateField = {};
					switch(vote_type) {
						case 'like':
						updateField = {likers_number: result};
						break;
						case 'admire':
						updateField = {admirers_number: result};
						break;
						case 'pity':
						updateField = {pitys_number: result};
						break;
						default:
						break;
					}

					return momentsHandler.updateEntryByIdForModel(moment_id, updateField).then(result => {
						resolve(result);
					}).catch(error => {
						reject(error);
					});
				}).catch(error => {
					reject(error);
				});
		});
};

module.exports = {
	postMoment: function(req, res, next) {
		momentRequestValidator.validateCreateMomentRequest(req).then(result => {

			var newMomentObj = {
					title: req.body.title,
					words: req.body.words,
					photos: req.body.photos,
					hash_tags: (req.body.hash_tags || []),
					attachment: req.body.attachment,
					location_id: req.body.location_id,
					access_level: req.body.access_level,
					together_with: (req.body.together_with || []),
					createdBy: req.user_id
				};

			var queries = [];
			queries.push(userRelationshipsHandler.findFollowerIdsByUserId(req.user_id));

			if (req.body.location_id == null && req.body.google_place) {
				var postReq = locationsHandler.createIfNotExistForGooglePlace(req.body.google_place, req.user_id).then(location_id => {
					newMomentObj.location_id = location_id;
					return momentsHandler.createEntryForModel(newMomentObj).then(result => {
						cLogger.say('save one moment successfully.', result);
						return result;
					});
				});
				queries.push(postReq);
			} else {
				var postReq = momentsHandler.createEntryForModel(newMomentObj).then(result => {
					cLogger.say('save one moment successfully.', result);
					return result;
				});
				queries.push(postReq);
			}

			return Promise.all(queries).then(results => {
				let followerIds = results[0].followerIds;
				let createdMoment = results[1];
				let activity = {
					actor: req.user_id,
					action: 'post',
					target: 'moment:'+createdMoment.id,
					actionTime: createdMoment.createdAt
				};

				res.status(httpStatus.CREATED).send(createdMoment);

				var dynamoReqs = [];
				dynamoReqs.push(activitiesHandler.insertActivityToAuthorTable(activity));
				if (createdMoment.access_level === 'public') {
					activity.hotType = 'Public';
					dynamoReqs.push(hotPostsHandler.insertActivityToHotTable(activity));
				} else if (createdMoment.access_level === 'followers') {
					if (followerIds.length > consts.DYNAMO_THRESHOLD_OF_FOLLOWERNUM) {
						activity.hotType = 'Popular';
						dynamoReqs.push(hotPostsHandler.insertActivityToHotTable(activity));
					} else if (followerIds.length > 0) {
						dynamoReqs.push(feedsHandler.insertActivityToFeedsOfFollowers(activity, followerIds));
					}
				}
				return Promise.all(dynamoReqs).then(dynamoRes => {
					cLogger.say('Successfully Insert This Moment to ActivityTable and FeedTable.');
				}).catch(dynamoError => {
					next(dynamoError);
				});
			}).catch(error => {
				next(error);
			});

		}).catch(error => {
			next(error);
		});
	},

	getMomentById: function(req, res, next) {
		momentRequestValidator.validateGetMomentByIdRequest(req).then(result => {

			return momentsHandler.findEntryByIdFromModel(req.params.id).then(result => {
                    res.status(httpStatus.OK).send(result);
                }).catch(err => {
                    next(err);
                });

		}).catch(error => {
			next(error);
		});
	},

	getMomentsByQuery: function(req, res, next) {
		momentRequestValidator.validateGetMomentsByQueryRequest(req).then(result => {

            var queryObj = {
                text: req.query.text,
                location_id: req.query.location_id,
                author_id: req.query.author_id,
                queryDateType: req.query.date_query_type,
                dateLine: req.query.date_query_line,
                limit: req.query.limit,
                offset: req.query.offset,
                joinWithVotes: false
            };
            if (req.query.voted_type && req.query.voted_by) {
            	queryObj.joinWithVotes = true;
            	queryObj.joinOptions = {
            		voted_type: req.query.voted_type,
            		voted_by: req.query.voted_by
            	};
            }

            return momentsHandler.findMomentsByQuery(queryObj)
                        .then(function(results) {
                            res.status(httpStatus.OK).send(results);
                        }).catch(function(error) {
                            next(error);
                        });

		}).catch(error => {
			next(error);
		})
	},

	updateMoment: function(req, res, next) {
		momentRequestValidator.validateUpdateMomentRequest(req).then(result => {

            var updateObj = {};
            if (req.body.title) {
                updateObj.title = req.body.title;
            }
            if (req.body.words) {
                updateObj.words = req.body.words;
            }
            if (req.body.photos) {
                updateObj.photos = req.body.photos;
            }
            if (req.body.hash_tags) {
                updateObj.hash_tags = req.body.hash_tags;
            }
            if (req.body.attachment) {
                updateObj.attachment = req.body.attachment;
            }
            if (req.body.location_id) {
                updateObj.location_id = req.body.location_id;
            }
            if (req.body.access_level) {
                updateObj.access_level = req.body.access_level;
            }
            if (req.body.together_with) {
                updateObj.together_with = req.body.together_with;
            }

            return momentsHandler.updateEntryByIdForModel(req.params.id, updateObj).then(result => {
            	res.status(httpStatus.OK).send(result);
            }).catch(error => {
            	next(error);
            });

		}).catch(error => {
			next(error);
		});
	},

	deleteMoment: function(req, res, next) {
		momentRequestValidator.validateGetMomentByIdRequest(req).then(result => {

			return momentsHandler.updateEntryByIdForModel(req.params.id, {
				deletedAt: new Date()
			}).then(result => {
				res.status(httpStatus.OK).send(result);
			}).catch(error => {
				next(error);
			});

		}).catch(error => {
			next(error);
		});
	},

	castOrChangeVoteForMoment: function(req, res, next) {
		momentRequestValidator.validateVoteForAMomentRequest(req).then(validationRes => {

			let voteForMoment = {
				vote_type: req.body.type,
				moment_id: req.params.id,
				createdBy: req.params.voterId
			};

			if (req.body.commit) {
				return Promise.all([
					votesForMomentsHandler.createEntryForModel(voteForMoment),
					momentsHandler.findEntryByIdFromModel(voteForMoment.moment_id)
				]).then(pgRes => {
					notificationsHandler.insertActivityToNotificationTable({
						recipient: pgRes[1].createdBy,
						actor: voteForMoment.createdBy,
						action: voteForMoment.vote_type,
						target: 'moment:'+voteForMoment.moment_id,
						actionTime: pgRes[0].createdAt
					}).then(notifyRes => {
						cLogger.say('Successfully added into DynamoDB Notification Table.');
					}).catch(notifyError => {
						cLogger.debug('Failed to add into DynamoDB Notification Table.');
					});
					cLogger.say('create a vote for moment successfully.', pgRes);
	                return updateVotesNumberOfMoment(voteForMoment.vote_type, voteForMoment.moment_id).then(result => {
	                	res.status(httpStatus.OK).send(result);
	                }).catch(error => {
	                	next(error);
	                });
				}).catch(error => {
					next(error);
				});

				// return votesForMomentsHandler.createEntryForModel(voteForMoment).then(result => {
					// cLogger.say('create a vote for moment successfully.', result);
	                // return updateVotesNumberOfMoment(voteForMoment.vote_type, voteForMoment.moment_id).then(result => {
	                // 	res.status(httpStatus.OK).send(result);
	                // }).catch(error => {
	                // 	next(error);
	                // });
// 
				// }).catch(error => {
				// 	next(error);
				// });
			} else {
				return votesForMomentsHandler.deleteVoteForMomentByContent(voteForMoment).then(deleteRes => {
	                cLogger.say('revote a vote for moment successfully.', deleteRes);
	                return updateVotesNumberOfMoment(voteForMoment.vote_type, voteForMoment.moment_id).then(result => {
	                	res.status(httpStatus.OK).send(result);
	                }).catch(error => {
	                	next(error);
	                });

				}).catch(error => {
					next(error);
				});
			}

		}).catch(error => {
			next(error);
		});

	},

	getVotersForMomentId: function(req, res, next) {
		momentRequestValidator.validateGetVotesForMomentIdRequest(req).then(result => {

			let queryObj = {
				voter_id: req.query.voter_id,
				vote_type: req.query.vote_type,
				moment_id: req.params.id,
				limit: req.query.limit,
				offset: req.query.offset
			};

			return votesForMomentsHandler.findVotesForMomentsByQuery(queryObj).then(results => {
				res.status(httpStatus.OK).send(results);
			}).catch(error => {
				next(error);
			});

		}).catch(error => {
			next(error);
		});
	}

}