/*
* @Author: KaileDing
* @Date:   2017-06-10 23:03:06
* @Last Modified by:   kaileding
* @Last Modified time: 2017-07-03 23:51:15
*/

'use strict';
import httpStatus from 'http-status'
import Promise from 'bluebird'
import momentRequestValidator from '../Validators/MomentRequestValidator'
import consts from '../config/Constants'
import MomentsHandler from '../handlers/MomentsHandler'
import VotesForMomentsHandler from '../handlers/VotesForMomentsHandler'
import LocationsHandler from '../handlers/LocationsHandler'
import models from '../models/Model_Index'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();
let momentsHandler = new MomentsHandler();
let votesForMomentsHandler = new VotesForMomentsHandler();
let locationsHandler = new LocationsHandler();

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

			if (req.body.location_id == null && req.body.google_place) {
				return locationsHandler.findEntriesFromModel(null, null, {
					google_place_id: req.body.google_place.google_place_id
				}, null).then(results => {
					if (results.count == 0) {
						return locationsHandler.createEntryForModel({
		                    loc_point: {
		                        type: 'Point',
		                        coordinates: [req.body.google_place.coordinates.latitude, req.body.google_place.coordinates.longitude],
		                        crs: { type: 'name', properties: { name: 'EPSG:4326'} }
		                    },
		                    name: req.body.google_place.name,
		                    icon: req.body.google_place.icon_url,
		                    types: req.body.google_place.types,
		                    google_place_id: req.body.google_place.google_place_id,
		                    createdBy: req.user_id,
		                    updatedBy: req.user_id
		                }).then(result => {
							newMomentObj.location_id = result.id;
							return momentsHandler.createEntryForModel(newMomentObj).then(result => {
				                cLogger.say(cLogger.TESTING_TYPE, 'save one moment successfully.', result);
				                res.status(httpStatus.CREATED).send(result);
							}).catch(error => {
								next(error);
							});

		                }).catch(error => {
		                	next(error);
		                });
					} else {
						let locationId = results.rows[0].id
						newMomentObj.location_id = locationId;
						return momentsHandler.createEntryForModel(newMomentObj).then(result => {
			                cLogger.say(cLogger.TESTING_TYPE, 'save one moment successfully.', result);
			                res.status(httpStatus.CREATED).send(result);
						}).catch(error => {
							next(error);
						});
					}

				}).catch(error => {
					next(error);
				});

			} else {
				return momentsHandler.createEntryForModel(newMomentObj).then(result => {
	                cLogger.say(cLogger.TESTING_TYPE, 'save one moment successfully.', result);
	                res.status(httpStatus.CREATED).send(result);
				}).catch(error => {
					next(error);
				});
			}

		}).catch(error => {
			next(error);
		})
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
		momentRequestValidator.validateVoteForAMomentRequest(req).then(result => {

			let voteForMoment = {
				vote_type: req.body.type,
				moment_id: req.params.id,
				createdBy: req.params.voterId
			};

			if (req.body.commit) {
				return votesForMomentsHandler.createEntryForModel(voteForMoment).then(result => {
	                cLogger.say(cLogger.TESTING_TYPE, 'create a vote for moment successfully.', result);
	                return updateVotesNumberOfMoment(voteForMoment.vote_type, voteForMoment.moment_id).then(result => {
	                	res.status(httpStatus.OK).send(result);
	                }).catch(error => {
	                	next(error);
	                });

				}).catch(error => {
					next(error);
				});
			} else {
				return votesForMomentsHandler.deleteVoteForMomentByContent(voteForMoment).then(result => {
	                cLogger.say(cLogger.TESTING_TYPE, 'revote a vote for moment successfully.', result);
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

			return votesForMomentsHandler.findVotesByMomentIdAndQuery(queryObj).then(results => {
				res.status(httpStatus.OK).send(results);
			}).catch(error => {
				next(error);
			});

		}).catch(error => {
			next(error);
		});
	}

}