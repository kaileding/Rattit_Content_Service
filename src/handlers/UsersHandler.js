/*
* @Author: KaileDing
* @Date:   2017-06-06 02:42:04
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-07 01:35:41
*/

'use strict';
import Promise from 'bluebird'
import models from '../models/Model_Index'
import rp from 'request-promise'
import httpStatus from 'http-status'
import APIError from '../helpers/APIError'
import CLogger from '../helpers/CustomLogger'
import consts from '../config/Constants'
let cLogger = new CLogger();

let findUsers = function(filterOjb) {
	return new Promise((resolve, reject) => {
			models.Users.findAll({
                where: filterOjb,
                order: [['follower_number', 'DESC']]
            }).then(function(results) {
                cLogger.say(cLogger.TESTING_TYPE, 'fetched results are', results);
                resolve(results);
            }).catch(function(error) {
                reject(error);
            });
		});
}

module.exports = {
	findAllUsers: function() {
		return new Promise((resolve, reject) => {
				models.Users.findAndCountAll({
		            order: [['follower_number', 'DESC']]
				}).then(function(results) {
			        cLogger.say(cLogger.TESTING_TYPE, 'fetched results are', results);
			        resolve(results);
				}).catch(function(error) {
					reject(error);
				});
			});
	},

	findUserByText: function(text) {
		let queryByUsername = findUsers({
			username: {
				ilike: '%'+text+'%'
			}
		});
		let queryByManifesto = findUsers({
			manifesto: {
                ilike: '%'+text+'%'
            }
		});

		return Promise.all([queryByUsername, queryByManifesto]).then((results) => {
                    var combinedRes = results[0];
                    combinedRes = combinedRes.concat(results[1]);
                    cLogger.say(cLogger.TESTING_TYPE, 'get '+combinedRes.length+' users successfully.');
                    return combinedRes;
                }).catch(function(error) {
                    throw error;
                });
	},

	findUserById: function(id) {
		return new Promise((resolve, reject) => {
				models.Users.findAndCountAll({
            		where: {
            			id: id
            		}
            	}).then(function(result) {
					cLogger.say(cLogger.TESTING_TYPE, 'get user successfully.', result);
					if (result.count === 1) {
						resolve(result.rows[0]);
					} else {
						reject(new APIError('User with id = '+id+' does not exist', httpStatus.NOT_FOUND));
					}
				}).catch(function(error) {
			    	reject(new APIError(error.message, httpStatus.INTERNAL_SERVER_ERROR));
			    })
			});
	},

	updateUserById: function(id, updateObj) {
		return new Promise((resolve, reject) => {
				models.Users.update(updateObj, {
                    where: {
                        id: id
                    },
                    validate: true,
                    limit: 1
                }).then((results) => {
                    if (results[0] === 1) {
                        return models.Users.findById(id).then(user => {
                                if (user) {
                                    resolve(user.toJSON());
                                } else {
                                	reject(new APIError('Error retrieving user entity', httpStatus.INTERNAL_SERVER_ERROR));
                                }
                            }).catch(err => {
                            	cLogger.say(cLogger.GENERAL_TYPE, `ERROR updating cart item : SQL ${err.message} ${JSON.stringify(err.errors)}`);
                                reject(new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR));
                            });
                    } else {
						reject(new APIError('User not exist for id: '+id, httpStatus.BAD_REQUEST));
                    }
                }).catch(err => {
					cLogger.say(cLogger.GENERAL_TYPE, `ERROR updating user : SQL ${err.message} ${JSON.stringify(err.errors)}`);
					reject(new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR));
                });
	        });
	},

	deleteUserById: function(id) {
		return new Promise((resolve, reject) => {
				models.Users.destroy({
                    where: {
                        id: id
                    },
                    limit: 1
                }).then(response => {
                    if (response === 1) {
                    	cLogger.say(cLogger.GENERAL_TYPE, `Deleted user with id '${id}'`);
                        resolve("OK");
                    } else if (response === 0) {
                    	cLogger.say(cLogger.GENERAL_TYPE, `Unable to delete nonexistent user with id '${id}'`);
                        reject(new APIError('User Not Found', httpStatus.NOT_FOUND));
                    } else { // should never happen
                    	reject(new APIError('Deleted multiple user, which should never happen', httpStatus.INTERNAL_SERVER_ERROR));
                    }
                }).catch(err => {
                	cLogger.say(cLogger.GENERAL_TYPE, `ERROR deleting user : SQL ${err.message} ${JSON.stringify(err.errors)}`);
                    reject(new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR));
                });
            });
	}
}
