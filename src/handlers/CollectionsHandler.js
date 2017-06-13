/*
* @Author: KaileDing
* @Date:   2017-06-13 01:00:49
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-13 01:15:58
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

class CollectionsHandler extends DataModelHandler {
	constructor() {
		super(models.Collections);
	}

	findCollectionsByQuery(queryObj) {

    	let queryText = queryObj.text ? Sequelize.or(
	        	{
	        		title: {
	        			ilike: '%'+queryObj.text+'%'
	        		}
	        	}, 
	        	{
	        		description: {
	        			ilike: '%'+queryObj.text+'%'
	        		}
	        	},
	        	{
	        		tags: {
	        			$contains: [queryObj.text.toLowerCase()]
	        		}
	        	}
	        ) : true;

        let queryOwnerId = queryObj.owner_id ? {
	        	createdBy: queryObj.owner_id
	        } : true;

		let filterObj = Sequelize.and(
			queryText,
			queryOwnerId
			);

		return this.findEntriesFromModel(null, filterObj, null, queryObj.limit, queryObj.offset);

	}

}

module.exports = CollectionsHandler;