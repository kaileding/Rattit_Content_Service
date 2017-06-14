/*
* @Author: KaileDing
* @Date:   2017-06-05 23:20:58
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-13 22:48:48
*/

'use strict';
import httpStatus from 'http-status'
import Promise from 'bluebird'
import userRequestValidator from '../Validators/UserRequestValidator'
import UsersHandler from '../handlers/UsersHandler'
import UserRelationshipsHandler from '../handlers/UserRelationshipsHandler'
import models from '../models/Model_Index'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();
let usersHandler = new UsersHandler();
let userRelationshipsHandler = new UserRelationshipsHandler();

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
                    cLogger.say(cLogger.TESTING_TYPE, 'save one user successfully.', result);
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
            cLogger.say(cLogger.TESTING_TYPE, 'req.query.text is ', req.query.text);

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

    followUsers: function(req, res, next) {
        userRequestValidator.validateFollowUsersRequest(req).then(result => {
            // res.status(httpStatus.OK).send('OK');

            var dataReqs = [];
            req.body.followees.forEach(followeeId => {
                dataReqs.push(
                    userRelationshipsHandler.createEntryForModel({
                        follower: req.params.id,
                        followee: followeeId
                    })
                );
            });

            return Promise.all(dataReqs).then(results => {
                res.status(httpStatus.CREATED).send(results);
            }).catch(error => {
                next(error);
            });

        }).catch(error => {
            next(error);
        })
    },

    unfollowAUser: function(req, res, next) {
        userRequestValidator.validateUnfollowUserRequest(req).then(result => {
            // res.status(httpStatus.OK).send('OK');

            return userRelationshipsHandler.deleteFolloweeByItsID(req.params.id, 
                                                                req.params.followee_id).then(result => {
                res.status(httpStatus.OK).send(result);
            }).catch(error => {
                next(error);
            });

        }).catch(error => {
            next(error);
        })
    }
}