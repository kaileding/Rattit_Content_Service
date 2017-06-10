/*
* @Author: KaileDing
* @Date:   2017-06-06 02:42:04
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-10 00:40:04
*/

'use strict';
import Promise from 'bluebird'
import models from '../models/Model_Index'
import DataModelHandler from './DataModelHandler'
import rp from 'request-promise'
import httpStatus from 'http-status'
import APIError from '../helpers/APIError'
import CLogger from '../helpers/CustomLogger'
import consts from '../config/Constants'
let userDataHandler = new DataModelHandler(models.Users);
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
    createUser: function(userObj) {
        return userDataHandler.createEntryForModel(userObj);
    },

	findAllUsers: function(number = 20) {
		return userDataHandler.findEntriesFromModel(number);
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
		return userDataHandler.findEntryByIdFromModel(id);
	},

	updateUserById: function(id, updateObj) {
		return userDataHandler.updateEntryByIdForModel(id, updateObj);
	},

	deleteUserById: function(id) {
		return userDataHandler.deleteEntryByIdFromModel(id);
	}
}
