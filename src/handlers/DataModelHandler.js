/*
* @Author: KaileDing
* @Date:   2017-06-09 13:29:03
* @Last Modified by:   kaileding
* @Last Modified time: 2017-07-05 02:59:29
*/

'use strict';
import Promise from 'bluebird'
import Sequelize from 'sequelize'
import dbConnectionPool from '../data/DBConnection'
import models from '../models/Model_Index'
import rp from 'request-promise'
import httpStatus from 'http-status'
import APIError from '../helpers/APIError'
import CLogger from '../helpers/CustomLogger'
import consts from '../config/Constants'
let cLogger = new CLogger();

class DataModelHandler {
	constructor(model) {
		this.model = model;
	}

	createEntryForModel(newEntryObj) {
		return new Promise((resolve, reject) => {
				let model = this.model;
				cLogger.say(cLogger.TESTING_TYPE, 'the object to be created in database is ', newEntryObj)
				model.create(newEntryObj).then(function(result) {
					cLogger.say(cLogger.TESTING_TYPE, 'save one entry successfully for model '+model.name+'.');
					resolve(result.toJSON());
				}).catch(function(error) {
			    	reject(error);
			    });

			});
	}

	findEntriesFromModel(selectObj, includeObj, filterObj, orderObj, entryQuantity = 20, offsetNumber = 0) {
		return new Promise((resolve, reject) => {
				let model = this.model;
				selectObj = selectObj || { exclude: [] };
				entryQuantity = entryQuantity || 20;
				entryQuantity = Number(entryQuantity);
				offsetNumber = offsetNumber || 0;
				offsetNumber = Number(offsetNumber);
				if (Number.isInteger(entryQuantity) && entryQuantity > 0) {
					model.findAndCountAll({
						attributes: selectObj,
						include: includeObj,
						where: filterObj,
			            order: (orderObj || [['createdAt', 'DESC']]),
			            limit: entryQuantity,
			            offset: offsetNumber
					}).then(function(results) {
				        cLogger.say(cLogger.TESTING_TYPE, 'fetched '+results.count+' results');
				        resolve(results);
					}).catch(function(error) {
						reject(error);
					});
				} else {
					reject(new APIError('Number of rows to fetch should be an integer'));
				}
			});
	}

	findEntriesFromModelWithSQL(countQueryStatement, queryStatement) {
		return new Promise((resolve, reject) => {
				let countQuery = dbConnectionPool.query(countQueryStatement, { type: Sequelize.QueryTypes.SELECT}).then(result => {
					return result;
				}).catch(error => {
					throw error;
				});

				let realQuery = dbConnectionPool.query(queryStatement, { type: Sequelize.QueryTypes.SELECT}).then(results => {
					return results;
				}).catch(error => {
					throw error;
				});

				Promise.all([countQuery, realQuery]).then(results => {

					var responseObj = {
						count: Number(results[0][0].count),
						rows: results[1]
					};
					resolve(responseObj);

				}).catch(error => {
					reject(error);
				})

			});
	}

	countEntriesFromModelForFilter(filterObj) {
		return new Promise((resolve, reject) => {
				let model = this.model;
				model.count({
					where: filterObj
				}).then(function(result) {
					cLogger.say(cLogger.TESTING_TYPE, `get count of entries successfully from ${model.name}.`, result);
					resolve(result);
				}).catch(function(error) {
					reject(new APIError(error.message, httpStatus.INTERNAL_SERVER_ERROR));
				});
			});
	}

	findEntryByIdFromModel(id) {
		return new Promise((resolve, reject) => {
				let model = this.model;
				model.findAndCountAll({
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
	}

	updateEntryByIdForModel(id, updateObj) {
		return new Promise((resolve, reject) => {
				let model = this.model;
				model.update(updateObj, {
                    where: {
                        id: id
                    },
                    validate: true,
                    fields: Object.keys(updateObj),
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
	}

	deleteEntryByIdFromModel(id) {
		return new Promise((resolve, reject) => {
				let model = this.model;
				model.destroy({
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
	}

}

module.exports = DataModelHandler;
