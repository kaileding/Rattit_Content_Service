/*
* @Author: KaileDing
* @Date:   2017-06-05 23:20:58
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-10 21:45:19
*/

'use strict';
import httpStatus from 'http-status'
import Promise from 'bluebird'
import userRequestValidator from '../Validators/UserRequestValidator'
import UsersHandler from '../handlers/UsersHandler'
import models from '../models/Model_Index'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();
let usersHandler = new UsersHandler();

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
                    res.status(httpStatus.OK).send(result);
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
                                                req.query.offset).then((results) => {
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

            return usersHandler.deleteEntryByIdFromModel(req.params.id).then(result => {
                    res.status(httpStatus.OK).send(result);
                }).catch(err => {
                    next(err);
                });

        }).catch(error => {
            next(error);
        });
	}
}