/*
* @Author: KaileDing
* @Date:   2017-06-12 23:53:20
* @Last Modified by:   kaileding
* @Last Modified time: 2017-08-01 00:37:38
*/

'use strict';
import Promise from 'bluebird'
import Sequelize from 'sequelize'
import dbConnectionPool from '../data/DBConnection'
import models from '../models/Model_Index'
import DataModelHandler from './DataModelHandler'
import rp from 'request-promise'
import httpStatus from 'http-status'
import APIError from '../helpers/APIError'
import CLogger from '../helpers/CustomLogger'
import consts from '../config/Constants'
let cLogger = new CLogger();

class CollectAssociationsHandler extends DataModelHandler {
	constructor(model, contentTableName, foreignKeyName) {
		super(model);
		this.contentTableName = contentTableName;
		this.foreignKeyName = foreignKeyName;
	}

	findContentsByCollectionId(id, limit, offset) {
		limit = (limit != null) ? Number(limit) : consts.DB_QUERY_DEFAULT_LIMIT;
		offset = (offset != null) ? Number(offset) : 0;
		let assoc_name = this.model.name;

		let countQueryStatement = 'SELECT count(*) '
							+ 'FROM "' + assoc_name + '" LEFT JOIN "' + this.contentTableName + '" '
							+ 'ON "' + assoc_name + '"."' + this.foreignKeyName + '" = "' + this.contentTableName + '"."id" '
							+ 'WHERE "' + assoc_name + '"."collection_id" = ' + "'" + id + "' "
							+ 'LIMIT ' + limit + ' ' 
							+ 'OFFSET ' + offset + ';';

		let queryStatement = 'SELECT "' + this.contentTableName + '".*, "' + assoc_name + '"."createdAt" as "relation_createdAt" '
							+ 'FROM "' + assoc_name + '" LEFT JOIN "' + this.contentTableName + '" '
							+ 'ON "' + assoc_name + '"."' + this.foreignKeyName + '" = "' + this.contentTableName + '"."id" '
							+ 'WHERE "' + assoc_name + '"."collection_id" = ' + "'" + id + "' "
							+ 'ORDER BY "' + assoc_name + '"."createdAt" DESC '
							+ 'LIMIT ' + limit + ' ' 
							+ 'OFFSET ' + offset + ';';

		return this.findEntriesFromModelWithSQL(countQueryStatement, queryStatement);
	}

	findCollectionsByContentId(id, limit, offset) {
		limit = (limit != null) ? Number(limit) : consts.DB_QUERY_DEFAULT_LIMIT;
		offset = (offset != null) ? Number(offset) : 0;
		let assoc_name = this.model.name;

		let countQueryStatement = 'SELECT count(*) '
							+ 'FROM "' + assoc_name + '" LEFT JOIN "collection" '
							+ 'ON "' + assoc_name + '"."collection_id" = "collection"."id" '
							+ 'WHERE "' + assoc_name + '"."' + this.foreignKeyName + '" = ' + "'" + id + "' "
							+ 'LIMIT ' + limit + ' ' 
							+ 'OFFSET ' + offset + ';';

		let queryStatement = 'SELECT "collection".*, "' + assoc_name + '"."createdAt" as "relation_createdAt" '
							+ 'FROM "' + assoc_name + '" LEFT JOIN "collection" '
							+ 'ON "' + assoc_name + '"."collection_id" = "collection"."id" '
							+ 'WHERE "' + assoc_name + '"."' + this.foreignKeyName + '" = ' + "'" + id + "' "
							+ 'ORDER BY "' + assoc_name + '"."createdAt" DESC '
							+ 'LIMIT ' + limit + ' ' 
							+ 'OFFSET ' + offset + ';';

		return this.findEntriesFromModelWithSQL(countQueryStatement, queryStatement);
	}

	removeContentFromCollection(id_Pair) {
		return new Promise((resolve, reject) => {
				let model = this.model;
				model.destroy({
					where: id_Pair
				}).then(response => {
                    if (response === 1) {
                    	cLogger.say(cLogger.GENERAL_TYPE, `Deleted one entry from ${model.name}`);
                        resolve("OK");
                    } else if (response === 0) {
                    	cLogger.say(cLogger.GENERAL_TYPE, `Unable to delete nonexistent entry from ${model.name}`);
                        reject(new APIError(`Entry Not Found in ${model.name}`, httpStatus.NOT_FOUND));
                    } else { // should never happen
                    	reject(new APIError('Deleted multiple entries, which should never happen', httpStatus.INTERNAL_SERVER_ERROR));
                    }
				}).catch(error => {
	            	cLogger.say(cLogger.GENERAL_TYPE, `ERROR deleting entries : SQL ${err.message} ${JSON.stringify(err.errors)}`);
	                reject(new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR));
				})
			});
	}

	deleteAssociationsByCollectionID(id) {
		return new Promise((resolve, reject) => {
				let model = this.model;
				model.destroy({
                    where: {
                    	collection_id: id
                    }
                }).then(response => {
                	cLogger.say(cLogger.GENERAL_TYPE, `Deleted ${response} entries with collection_id '${id}' from ${model.name}`);
                    resolve(response);
                }).catch(err => {
                	cLogger.say(cLogger.GENERAL_TYPE, `ERROR deleting entries : SQL ${err.message} ${JSON.stringify(err.errors)}`);
                    reject(new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR));
                });
            });
	}

}

module.exports = CollectAssociationsHandler;
