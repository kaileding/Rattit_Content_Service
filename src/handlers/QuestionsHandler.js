/*
* @Author: KaileDing
* @Date:   2017-06-11 21:50:40
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-11 23:05:44
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

class QuestionsHandler extends DataModelHandler {
	constructor() {
		super(models.Questions);
	}

	findQuestionsJoinWithVotes(options, limit, offset) {
		limit = (limit != null) ? Number(limit) : 20;
		offset = (offset != null) ? Number(offset) : 0;

		let statementMainPart = 'FROM "votes_for_question" LEFT JOIN "question" '
							+ 'ON "votes_for_question"."question_id" = "question"."id" '
							+ 'WHERE "votes_for_question"."vote_type" = ' + "'" + options.voted_type + "' "
							+ (options.voted_by ? 
								'AND "votes_for_question"."createdBy" = ' + "'" + options.voted_by + "' "
								: '')
							+ (options.subject_id ? 
								'AND "votes_for_question"."subject_id" = ' + "'" + options.subject_id + "' "
								: '');

		let countQueryStatement = 'SELECT count(*) '
							+ statementMainPart
							+ 'LIMIT ' + limit + ' ' 
							+ 'OFFSET ' + offset + ';';

		let queryStatement = 'SELECT "question".*, "votes_for_question"."createdAt" as "vote_createdAt" '
							+ statementMainPart
							+ 'ORDER BY "votes_for_question"."createdAt" DESC '
							+ 'LIMIT ' + limit + ' ' 
							+ 'OFFSET ' + offset + ';';

		return this.findEntriesFromModelWithSQL(countQueryStatement, queryStatement);
	}

	findQuestionsByQuery(queryObj) {
		if (queryObj.joinWithVotes) {

			return this.findQuestionsJoinWithVotes(queryObj.joinOptions, queryObj.limit, queryObj.offset);

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

module.exports = QuestionsHandler;
