/*
* @Author: KaileDing
* @Date:   2017-06-05 23:20:58
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-10 20:47:25
*/

'use strict';
import httpStatus from 'http-status'
import Promise from 'bluebird'
import userRequestValidator from '../Validators/UserRequestValidator'
import UsersHandler from '../handlers/UsersHandler'
import UserRelationshipsHandler from '../handlers/UserRelationshipsHandler'
import DynamoFeedsHandler from '../handlers/DynamoFeedsHandler'
import DynamoActivitiesHandler from '../handlers/DynamoActivitiesHandler'
import models from '../models/Model_Index'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();
let usersHandler = new UsersHandler();
let userRelationshipsHandler = new UserRelationshipsHandler();
let feedsHandler = new DynamoFeedsHandler();
let activitiesHandler = new DynamoActivitiesHandler();

module.exports = {
	createUser: function(req, res, next) {
		userRequestValidator.validateCreateUserRequest(req).then(result => {
            
            return usersHandler.createEntryForModel({
                    username: req.body.username,
                    email: req.body.email,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    gender: req.body.gender,
                    manifesto: req.body.manifesto,
                    organization: req.body.organization,
                    avatar: req.body.avatar
                }).then(function(result) {
                    cLogger.debug('save one user successfully.', result);
                    res.status(httpStatus.CREATED).send(result);
                }).catch(function(error) {
                    next(error);
                });

        }).catch(error => {
            next(error);
        });
	},

	getUserById: function(req, res, next) {
		userRequestValidator.validateGetUserByIdRequest(req).then(result => {

            return usersHandler.findEntryByIdFromModel(req.params.id).then(result => {
                    res.status(httpStatus.OK).send(result);
                }).catch(err => {
                    next(err);
                });

        }).catch(error => {
            next(error);
        });
	},

	getUsersByQuery: function(req, res, next) {
        userRequestValidator.validateGetUserByTextRequest(req).then(result => {
            cLogger.debug('req.query.text is ', req.query.text);

            return usersHandler.findUserByText(req.query.text, 
                                                req.query.limit, 
                                                req.query.offset).then(results => {
                    res.status(httpStatus.OK).send(results);
                }).catch(function(error) {
                    next(error);
                });

        }).catch(error => {
            next(error);
        });
	},

	updateUser: function(req, res, next) {
		userRequestValidator.validateUpdateUserRequest(req).then(result => {

            var updateObj = {};
            if (req.body.username) {
                updateObj.username = req.body.username;
            }
            if (req.body.manifesto) {
                updateObj.manifesto = req.body.manifesto;
            }
            if (req.body.organization) {
                updateObj.organization = req.body.organization;
            }
            if (req.body.avatar) {
                updateObj.avatar = req.body.avatar;
            }

            return usersHandler.updateEntryByIdForModel(req.params.id, updateObj).then(result => {
                    res.status(httpStatus.OK).send(result);
                }).catch(err => {
                    next(err);
                });

        }).catch(error => {
            next(error);
        });
	},

	deleteUser: function(req, res, next) {
		userRequestValidator.validateGetUserByIdRequest(req).then(result => {

            return usersHandler.updateEntryByIdForModel(req.params.id, {
                deletedAt: new Date()
            }).then(result => {
                    res.status(httpStatus.OK).send(result);
                }).catch(err => {
                    next(err);
                });

        }).catch(error => {
            next(error);
        });
	}, 

    getFollowersOfAUser: function(req, res, next) {
        userRequestValidator.validateGetRelationshipsOfUserRequest(req).then(result => {

            return userRelationshipsHandler.findFollowersByUserId(req.params.id, 
                                                                    req.query.limit, 
                                                                    req.query.offset).then(results => {
                    res.status(httpStatus.OK).send(results);
                }).catch(error => {
                    next(error);
                });

        }).catch(error => {
            next(error);
        });
    },

    getFolloweesOfAUser: function(req, res, next) {
        userRequestValidator.validateGetRelationshipsOfUserRequest(req).then(result => {

            return userRelationshipsHandler.findFolloweesByUserId(req.params.id, 
                                                                    req.query.limit, 
                                                                    req.query.offset).then(results => {
                    res.status(httpStatus.OK).send(results);
                }).catch(error => {
                    next(error);
                });

        }).catch(error => {
            next(error);
        });
    },

    getFriendsOfAUser: function(req, res, next) {
        userRequestValidator.validateGetRelationshipsOfUserRequest(req).then(result => {

            return userRelationshipsHandler.findFriendsByUserId(req.params.id, 
                                                                    req.query.limit, 
                                                                    req.query.offset).then(results => {
                    res.status(httpStatus.OK).send(results);
                }).catch(error => {
                    next(error);
                });

        }).catch(error => {
            next(error);
        });
    },

    followUsers: function(req, res, next) {
        userRequestValidator.validateFollowUsersRequest(req).then(result => {

            var dataReqs = [];
            req.body.followees.forEach(followeeId => {
                dataReqs.push(
                    userRelationshipsHandler.createEntryForModel({
                        follower: req.params.id,
                        followee: followeeId
                    }).then(creationResult => {
                        feedsHandler.copyRecordsFromAuthorToRecipient(followeeId, 100, req.params.id).then(copyRes => {
                            cLogger.say('Successfully Copied Records of An Author into Feed of Recipient.');
                        }).catch(copyError => {
                            cLogger.debug('Failed copyRecordsFromAuthorToRecipient()', copyError);
                        });
                        return userRelationshipsHandler.findFollowerIdsByUserId(followeeId).then(result => {
                            return usersHandler.updateEntryByIdForModel(followeeId, {
                                follower_number: result.count
                            });
                        }).catch(error => {
                            throw error;
                        });
                    }).catch(error => {
                        throw error;
                    })
                );
            });

            return Promise.all(dataReqs).then(results => {
                // TODO: should add logic to update the follower number / following number of corresponding users
                return userRelationshipsHandler.countEntriesFromModelForFilter({
                            follower: req.params.id
                        }).then(countResult => {
                            return usersHandler.updateEntryByIdForModel(req.params.id, {
                                followee_number: countResult
                            }).then(result => {
                                res.status(httpStatus.CREATED).send(results);
                            }).catch(error => {
                                next(error);
                            })
                        }).catch(error => {
                            next(error);
                        });
            }).catch(error => {
                next(error);
            });

        }).catch(error => {
            next(error);
        })
    },

    unfollowAUser: function(req, res, next) {
        userRequestValidator.validateUnfollowUserRequest(req).then(result => {

            return userRelationshipsHandler.deleteFolloweeByItsID(req.params.id, 
                                                                req.params.followee_id).then(deleteResult => {
                                                                    
                feedsHandler.removeRecordsOfAuthorFromRecipientFeed(req.params.followee_id, req.params.id).then(removeRes => {
                    cLogger.say('Successfully Removed Records of An Author from Feed of Recipient.');
                }).catch(removeError => {
                    cLogger.debug('Failed removeRecordsOfAuthorFromRecipientFeed()', removeError);
                });

                res.status(httpStatus.OK).send({
                    success: deleteResult
                });

                return userRelationshipsHandler.findFollowerIdsByUserId(req.params.followee_id).then(result => {
                    return usersHandler.updateEntryByIdForModel(req.params.followee_id, {
                        follower_number: result.count
                    }).then(updateRes1 => {
                        return userRelationshipsHandler.countEntriesFromModelForFilter({
                                follower: req.params.id
                            }).then(countResult => {
                                return usersHandler.updateEntryByIdForModel(req.params.id, {
                                    followee_number: countResult
                                }).then(updateRes2 => {
                                    cLogger.say('Successfully Updated the Count of Followers/Followings of Users.');
                                }).catch(error => {
                                    next(error);
                                });
                            }).catch(error => {
                                next(error);
                            });
                    }).catch(error => {
                        next(error);
                    });
                }).catch(error => {
                    next(error);
                });
            }).catch(error => {
                next(error);
            });

        }).catch(error => {
            next(error);
        })
    }
}