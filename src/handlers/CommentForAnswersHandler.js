/*
* @Author: KaileDing
* @Date:   2017-06-12 16:53:32
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-21 23:34:13
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

class CommentForAnswersHandler extends DataModelHandler {
	constructor() {
		super(models.CommentsForAnswer);
	}

	findCommentsByQuery(queryObj) {

		let includeObj = [{
			model: models.Users
		}];

		let queryAnswerId = queryObj.for_answer ? {
				for_answer: queryObj.for_answer
			} : true;

		let queryCommentId = queryObj.for_comment ? {
				for_comment: queryObj.for_comment
			} : true;

    	let queryText = queryObj.text ? {
        		words: {
        			ilike: '%'+queryObj.text+'%'
        		}
        	} : true;

        let queryAuthorId = queryObj.author_id ? {
	        	createdBy: queryObj.author_id
	        } : true;

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
       			default:
	       			queryVote = true;
	       			break;
       		}
       	} else {
       		queryVote = true;
       	}

	    let queryDate;
	    if (queryObj.queryDateType === 'nolater_than' && queryObj.dateLine) {
	    	queryDate = {
	    		createdAt: {
	    			$lte: queryObj.dateLine
	    		}
	    	};
    	} else if (queryObj.queryDateType === 'noearlier_than' && queryObj.dateLine) {
    		queryDate = {
    			createdAt: {
    				$gte: queryObj.dateLine
    			}
    		};
    	} else {
    		queryDate = true;
    	}

		let filterObj = Sequelize.and(
			queryAnswerId,
			queryCommentId,
			queryText,
			queryAuthorId,
			queryVote,
			queryDate
			);

		return this.findEntriesFromModel(null, includeObj, filterObj, null, queryObj.limit, queryObj.offset);

	}


	updateVoteOfCommentForMoment(id, updateObj) {

		return new Promise((resolve, reject) => {
			return this.model.findById(id).then(comment => {
				if (comment) { // Successfully get the instance.

					var index = null;
					var change_happen = false;
					switch(updateObj.vote_type) {
						case 'like':
							if (updateObj.commit) {
								if (!(comment.likedBy.includes(updateObj.voted_by))) {
									comment.likedBy.push(updateObj.voted_by);
									change_happen = true;
								}
							} else {
								index = comment.likedBy.indexOf(updateObj.voted_by);
								if (index > -1) {
									comment.likedBy.splice(index, 1);
									change_happen = true;
								}
							}
							break;
						default:
							break;
					}

					if (change_happen) {
						return this.updateEntryByIdForModel(id, {
							likedBy: comment.likedBy
						}).then(result => {
							resolve(result);
						}).catch(error => {
							reject(error);
						});
					} else {
						resolve(comment);
					}

				} else { // Failed to find the instance.
					reject(new APIError(`Comment with id '${id}' not found in database.`));
				}
			}).catch(error => {
				reject(error);
			});
		});
			
	}

}

module.exports = CommentForAnswersHandler;
