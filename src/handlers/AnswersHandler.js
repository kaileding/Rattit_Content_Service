/*
* @Author: KaileDing
* @Date:   2017-06-12 00:12:47
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-19 23:41:30
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

class AnswersHandler extends DataModelHandler {
	constructor() {
		super(models.Answers);
	}

	findAnswersJoinWithVotes(options, limit, offset) {
		limit = (limit != null) ? Number(limit) : 20;
		offset = (offset != null) ? Number(offset) : 0;

		let statementMainPart = 'FROM "votes_for_answer" LEFT JOIN "answer" '
							+ 'ON "votes_for_answer"."answer_id" = "answer"."id" '
							+ 'WHERE "votes_for_answer"."vote_type" = ' + "'" + options.voted_type + "' "
							+ 'AND "votes_for_answer"."createdBy" = ' + "'" + options.voted_by + "' ";

		let countQueryStatement = 'SELECT count(*) '
							+ statementMainPart
							+ 'LIMIT ' + limit + ' ' 
							+ 'OFFSET ' + offset + ';';

		let queryStatement = 'SELECT "answer".*, "votes_for_answer"."createdAt" as "vote_createdAt" '
							+ statementMainPart
							+ 'ORDER BY "votes_for_answer"."createdAt" DESC '
							+ 'LIMIT ' + limit + ' ' 
							+ 'OFFSET ' + offset + ';';

		return this.findEntriesFromModelWithSQL(countQueryStatement, queryStatement);
	}

	findAnswersByQuery(queryObj) {
		if (queryObj.joinWithVotes) {

			return this.findAnswersJoinWithVotes(queryObj.joinOptions, queryObj.limit, queryObj.offset);

		} else {

			let includeObj = [{
				model: models.Users
			}];

			let queryQuestionId = queryObj.for_question ? {
					for_question: queryObj.for_question
				} : true;

        	let queryText = queryObj.text ? Sequelize.or(
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

	        let queryAuthorId = queryObj.author_id ? {
		        	createdBy: queryObj.author_id
		        } : true;

			let filterObj = Sequelize.and(
				queryQuestionId,
				queryText,
				queryAuthorId
				);

			return this.findEntriesFromModel(null, includeObj, filterObj, null, queryObj.limit, queryObj.offset);
		}

	}

}

module.exports = AnswersHandler;
