/*
* @Author: KaileDing
* @Date:   2017-06-06 02:42:04
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-06 03:23:22
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
		return models.Users.findAndCountAll({
            order: [['follower_number', 'DESC']]
		}).then(function(results) {
	        cLogger.say(cLogger.TESTING_TYPE, 'fetched results are', results);
	        return results;
		}).catch(function(error) {
			throw error;
		})
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
	}
}