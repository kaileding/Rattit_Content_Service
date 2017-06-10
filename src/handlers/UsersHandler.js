/*
* @Author: KaileDing
* @Date:   2017-06-06 02:42:04
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-10 03:00:06
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
let cLogger = new CLogger();

class UsersHandler extends DataModelHandler {
	constructor() {
		super(models.Users);
	}

	findUsers(filterOjb) {
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

	findUserByText(text) {
		let queryByUsername = this.findUsers({
			username: {
				ilike: '%'+text+'%'
			}
		});
		let queryByManifesto = this.findUsers({
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

module.exports = UsersHandler;
