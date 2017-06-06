/*
* @Author: KaileDing
* @Date:   2017-06-05 23:20:58
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-06 03:06:10
*/

'use strict';
import httpStatus from 'http-status'
import Promise from 'bluebird'
import userRequestValidator from '../helpers/UserRequestValidator'
import usersHandler from '../handlers/UsersHandler'
import models from '../models/Model_Index'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();

module.exports = {
	createUser: function(req, res, next) {
		userRequestValidator.validateCreateUserRequest(req);
		req.getValidationResult().then(result => {
            if (!result.isEmpty()) {
            	cLogger.say(cLogger.TESTING_TYPE, 'At least one error.');
                res.status(httpStatus.BAD_REQUEST).send({
                	message: 'request validation failed.',
                	error: result.array()
                });
            } else {
            	cLogger.say(cLogger.TESTING_TYPE, 'validation passed.');

            	return models.Users.create({
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
					res.status(httpStatus.OK).send(result.toJSON());
				}).catch(function(error) {
			    	throw error;
			    });
            }
        });
	},

	getUserById: function(req, res, next) {
		userRequestValidator.validateGetUserByIdRequest(req);
		req.getValidationResult().then(result => {
            if (!result.isEmpty()) {
            	cLogger.say(cLogger.TESTING_TYPE, 'At least one error.');
                res.status(httpStatus.BAD_REQUEST).send({
                	message: 'request validation failed.',
                	error: result.array()
                });
            } else {
            	cLogger.say(cLogger.TESTING_TYPE, 'validation passed.');

            	return models.Users.findAndCountAll({
            		where: {
            			id: req.params.id
            		}
            	}).then(function(result) {
					cLogger.say(cLogger.TESTING_TYPE, 'get one user successfully.', result);
					res.status(httpStatus.OK).send(result);
				}).catch(function(error) {
			    	throw error;
			    });
            }
        });
	},

	getUserByQuery: function(req, res, next) {
        cLogger.say(cLogger.TESTING_TYPE, 'req.query.text is ', req.query.text);
        if (req.query.text === null || req.query.text === undefined) {
            cLogger.say(cLogger.TESTING_TYPE, 'get all users.');

            return usersHandler.findAllUsers().then((results) => {
                    res.status(httpStatus.OK).send(results);
                }).catch(function(error) {
                    throw error;
                });
        } else if (typeof req.query.text === 'string') {
            cLogger.say(cLogger.TESTING_TYPE, 'validation passed.');

                return usersHandler.findUserByText(req.query.text).then((results) => {
                    res.status(httpStatus.OK).send(results);
                }).catch(function(error) {
                    throw error;
                });
        } else {
            cLogger.say(cLogger.TESTING_TYPE, 'At least one error.');
            res.status(httpStatus.BAD_REQUEST).send({
                message: 'request validation failed.',
                error: 'text in query is not string.'
            });
        }
	},

	updateUser: function(req, res, next) {
		userRequestValidator.validateUpdateUserRequest(req);
		req.getValidationResult().then(result => {
            if (!result.isEmpty()) {
            	cLogger.say(cLogger.TESTING_TYPE, 'At least one error.');
                res.status(httpStatus.BAD_REQUEST).send({
                	message: 'request validation failed.',
                	error: result.array()
                });
            } else {
            	cLogger.say(cLogger.TESTING_TYPE, 'validation passed.');

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

            	return models.Users.update(updateObj, {
                    where: {
                        id: req.params.id
                    },
                    validate: true,
                    limit: 1
                }).then((results) => {
                    if (results[0] === 1) {
                        return models.Users.findById(req.params.id).then(user => {
                                if (user) {
                                    user = user.toJSON();
                                    res.status(httpStatus.OK).send(user);
                                } else {
                                    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
                                        "message": 'Error retrieving user entity'
                                    });
                                }
                            }).catch(err => {
                            	cLogger.say(cLogger.GENERAL_TYPE, `ERROR updating cart item : SQL ${err.message} ${JSON.stringify(err.errors)}`);
                                res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
                            });
                    } else {
                        res.status(httpStatus.BAD_REQUEST).send({
                            "message": 'User not exist for id: '+req.params.id
                        });
                    }
                }).catch(err => {
					cLogger.say(cLogger.GENERAL_TYPE, `ERROR updating user : SQL ${err.message} ${JSON.stringify(err.errors)}`);
                    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
                });
            }
        });
	},

	deleteUser: function(req, res, next) {
		userRequestValidator.validateGetUserByIdRequest(req);
		req.getValidationResult().then(result => {
            if (!result.isEmpty()) {
            	cLogger.say(cLogger.TESTING_TYPE, 'At least one error.');
                res.status(httpStatus.BAD_REQUEST).send({
                	message: 'request validation failed.',
                	error: result.array()
                });
            } else {
            	cLogger.say(cLogger.TESTING_TYPE, 'validation passed.');

            	return models.Users.destroy({
                        where: {
                            id: req.params.id
                        },
                        limit: 1
                    }).then(response => {
                        if (response === 1) {
                        	cLogger.say(cLogger.GENERAL_TYPE, `Deleted user with id '${req.params.id}'`);
                            res.sendStatus(httpStatus.OK);
                        } else if (response === 0) {
                        	cLogger.say(cLogger.GENERAL_TYPE, `Unable to delete nonexistent user with id '${req.params.id}'`);
                            res.status(httpStatus.NOT_FOUND).send({
                                "message": "user not exist"
                            });
                        } else { // should never happen
                            res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
                                "message": "Deleted multiple user, which should never happen"
                            });
                        }
                    }).catch(err => {
                    	cLogger.say(cLogger.GENERAL_TYPE, `ERROR deleting user : SQL ${err.message} ${JSON.stringify(err.errors)}`);
                        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
                    });
            }
        });
	}
}