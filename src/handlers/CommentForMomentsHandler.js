/*
* @Author: KaileDing
* @Date:   2017-06-12 02:16:21
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-12 02:36:07
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

class CommentForMomentsHandler extends DataModelHandler {
	constructor() {
		super(models.CommentsForMoment);
	}

	findCommentsByQuery(queryObj) {

		let queryMomentId = queryObj.for_moment ? {
				for_moment: queryObj.for_moment
			} : true;

		let queryCommentId = queryObj.for_comment ? {
				for_comment: queryObj.for_comment
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


        		voted_type: req.query.voted_type,
        		voted_by: req.query.voted_by

    	let queryVote;
       	if (queryObj.voted_type && queryObj.voted_by) {
       		switch(queryObj.voted_type) {
       			case 'like':
       			queryVote = {
       				likedBy: {
       					$contains: [queryObj.voted_by]
       				}
       			};
       			break;
       			case 'dislike':
       			queryVote = {
       				dislikedBy: {
       					$contains: [queryObj.voted_by]
       				}
       			};
       			break;
       			default:
       			queryVote = true;
       			break;
       		}
       	} else {
       		queryVote = true;
       	}

		let filterObj = Sequelize.and(
			queryMomentId,
			queryCommentId,
			queryText,
			queryAuthorId,
			queryVote
			);

		return this.findEntriesFromModel(null, filterObj, null, queryObj.limit, queryObj.offset);

	}

}

module.exports = CommentForMomentsHandler;
