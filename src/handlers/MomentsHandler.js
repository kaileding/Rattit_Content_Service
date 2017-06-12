/*
* @Author: KaileDing
* @Date:   2017-06-11 01:19:19
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-11 19:57:11
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

class MomentsHandler extends DataModelHandler {
	constructor() {
		super(models.Moments);
	}

	findMomentsJoinWithVotes(options, limit, offset) {
		limit = (limit != null) ? Number(limit) : 20;
		offset = (offset != null) ? Number(offset) : 0;

		let countQueryStatement = 'SELECT count(*) '
							+ 'FROM "votes_for_moment" LEFT JOIN "moment" '
							+ 'ON "votes_for_moment"."moment_id" = "moment"."id" '
							+ 'WHERE "votes_for_moment"."createdBy" = ' + "'" + options.voted_by + "' "
							+ 'AND  "votes_for_moment"."vote_type" = ' + "'" + options.voted_type + "' "
							+ 'LIMIT ' + limit + ' ' 
							+ 'OFFSET ' + offset + ';';

		let queryStatement = 'SELECT "moment".*, "votes_for_moment"."createdAt" as "vote_createdAt" '
							+ 'FROM "votes_for_moment" LEFT JOIN "moment" '
							+ 'ON "votes_for_moment"."moment_id" = "moment"."id" '
							+ 'WHERE "votes_for_moment"."createdBy" = ' + "'" + options.voted_by + "' "
							+ 'AND  "votes_for_moment"."vote_type" = ' + "'" + options.voted_type + "' "
							+ 'ORDER BY "votes_for_moment"."createdAt" DESC '
							+ 'LIMIT ' + limit + ' ' 
							+ 'OFFSET ' + offset + ';';

		return this.findEntriesFromModelWithSQL(countQueryStatement, queryStatement);
	}

	findMomentsByQuery(queryObj) {
		if (queryObj.joinWithVotes) {
			let options = {
				voted_type: queryObj.voted_type,
				voted_by: queryObj.voted_by
			};

			return this.findMomentsJoinWithVotes(options, queryObj.limit, queryObj.offset);
		} else {

        	let queryText = queryObj.text ? Sequelize.or(
		        	{
		        		title: {
		        			ilike: '%'+queryObj.text+'%'
		        		}
		        	}, 
		        	{
		        		words: {
		        			ilike: '%'+queryObj.text+'%'
		        		}
		        	},
		        	{
		        		hash_tags: {
		        			$contains: [queryObj.text.toLowerCase()]
		        		}
		        	}
		        ) : true;

        	let queryLocationId = queryObj.location_id ? {
	        		location_id: queryObj.location_id
	        	} : true;

	        let queryAuthorId = queryObj.author_id ? {
		        	createdBy: queryObj.author_id
		        } : true;

			let filterObj = Sequelize.and(
				queryText,
				queryLocationId,
				queryAuthorId
				);

			return this.findEntriesFromModel(null, filterObj, null, queryObj.limit, queryObj.offset);
		}

	}

}

module.exports = MomentsHandler;