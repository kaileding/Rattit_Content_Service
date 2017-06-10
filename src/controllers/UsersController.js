/*
* @Author: KaileDing
* @Date:   2017-06-05 23:20:58
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-10 00:46:05
*/

'use strict';
import httpStatus from 'http-status'
import Promise from 'bluebird'
import userRequestValidator from '../Validators/UserRequestValidator'
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

            	return usersHandler.createUser({
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
					res.status(httpStatus.OK).send(result);
				}).catch(function(error) {
			    	next(error);
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

            	return usersHandler.findUserById(req.params.id).then(result => {
                    res.status(httpStatus.OK).send(result);
                }).catch(err => {
                    next(err);
                });
            }
        });
	},

	getUsersByQuery: function(req, res, next) {
        cLogger.say(cLogger.TESTING_TYPE, 'req.query.text is ', req.query.text);
        if (req.query.text === null || req.query.text === undefined) {
            cLogger.say(cLogger.TESTING_TYPE, 'get all users.');

            return usersHandler.findAllUsers().then((results) => {
                    res.status(httpStatus.OK).send(results);
                }).catch(function(error) {
                    next(error);
                });
        } else if (typeof req.query.text === 'string') {
            cLogger.say(cLogger.TESTING_TYPE, 'validation passed.');

                return usersHandler.findUserByText(req.query.text).then((results) => {
                    res.status(httpStatus.OK).send(results);
                }).catch(function(error) {
                    next(error);
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

            	return usersHandler.updateUserById(req.params.id, updateObj).then(result => {
                    res.status(httpStatus.OK).send(result);
                }).catch(err => {
                    next(err);
                })
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

            	return usersHandler.deleteUserById(req.params.id).then(result => {
                    res.status(httpStatus.OK).send(result);
                }).catch(err => {
                    next(err);
                });
            }
        });
	}
}