/*
* @Author: KaileDing
* @Date:   2017-06-09 13:29:03
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-09 23:26:53
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

module.exports = function(model) {
	this.model = model;

	this.createEntryForModel = function(newEntryObj) {
		let model = this.model;

		return new Promise((resolve, reject) => {
				this.model.create(newEntryObj).then(function(result) {
					cLogger.say(cLogger.TESTING_TYPE, 'save one entry successfully for model '+model.name+'.', result);
					resolve(result.toJSON());
				}).catch(function(error) {
			    	reject(error);
			    });

			});
	};

	this.findEntriesFromModel = function(entryQuantity = 20) {
		return new Promise((resolve, reject) => {
				entryQuantity = Number(entryQuantity);
				if (Number.isInteger(entryQuantity) && entryQuantity > 0) {
					this.model.findAndCountAll({
			            order: [['createdAt', 'DESC']],
			            limit: entryQuantity
					}).then(function(results) {
				        cLogger.say(cLogger.TESTING_TYPE, 'fetched results are', results);
				        resolve(results);
					}).catch(function(error) {
						reject(error);
					});
				} else {
					reject(new APIError('Number of rows to fetch should be an integer'));
				}
			});
	};

	this.findEntryByIdFromModel = function(id) {
		let model = this.model;

		return new Promise((resolve, reject) => {
				this.model.findAndCountAll({
            		where: {
            			id: id
            		}
            	}).then(function(result) {
					cLogger.say(cLogger.TESTING_TYPE, `get entry successfully from ${model.name}.`, result);
					if (result.count === 1) {
						resolve(result.rows[0]);
					} else {
						reject(new APIError('Entry with id = '+id+' does not exist in '+model.name, httpStatus.NOT_FOUND));
					}
				}).catch(function(error) {
			    	reject(new APIError(error.message, httpStatus.INTERNAL_SERVER_ERROR));
			    })
			});
	};

	this.updateEntryByIdForModel = function(id, updateObj) {
		let model = this.model;

		return new Promise((resolve, reject) => {
				this.model.update(updateObj, {
                    where: {
                        id: id
                    },
                    validate: true,
                    limit: 1
                }).then((results) => {
                    if (results[0] === 1) {
                        return model.findById(id).then(result => {
                                if (result) {
                                    resolve(result.toJSON());
                                } else {
                                	reject(new APIError('Error retrieving '+model.name+' entity', httpStatus.INTERNAL_SERVER_ERROR));
                                }
                            }).catch(err => {
                            	cLogger.say(cLogger.GENERAL_TYPE, `ERROR updating cart item : SQL ${err.message} ${JSON.stringify(err.errors)}`);
                                reject(new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR));
                            });
                    } else {
						reject(new APIError('Entry not exist for id: '+id+' in '+model.name, httpStatus.BAD_REQUEST));
                    }
                }).catch(err => {
					cLogger.say(cLogger.GENERAL_TYPE, `ERROR updating entry : SQL ${err.message} ${JSON.stringify(err.errors)}`);
					reject(new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR));
                });
	        });
	};

	this.deleteEntryByIdFromModel = function(id) {
		let model = this.model;

		return new Promise((resolve, reject) => {
				this.model.destroy({
                    where: {
                        id: id
                    },
                    limit: 1
                }).then(response => {
                    if (response === 1) {
                    	cLogger.say(cLogger.GENERAL_TYPE, `Deleted entry with id '${id}' from ${model.name}`);
                        resolve("OK");
                    } else if (response === 0) {
                    	cLogger.say(cLogger.GENERAL_TYPE, `Unable to delete nonexistent entry with id '${id}' in ${model.name}`);
                        reject(new APIError(`Entry with id '${id}' Not Found in ${model.name}`, httpStatus.NOT_FOUND));
                    } else { // should never happen
                    	reject(new APIError('Deleted multiple entries, which should never happen', httpStatus.INTERNAL_SERVER_ERROR));
                    }
                }).catch(err => {
                	cLogger.say(cLogger.GENERAL_TYPE, `ERROR deleting entry : SQL ${err.message} ${JSON.stringify(err.errors)}`);
                    reject(new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR));
                });
            });
	};

	return this;
}
