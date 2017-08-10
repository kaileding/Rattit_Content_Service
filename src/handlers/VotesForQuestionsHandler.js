/*
* @Author: KaileDing
* @Date:   2017-06-11 22:14:18
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-10 01:10:01
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

class VotesForQuestionsHandler extends DataModelHandler {
	constructor() {
		super(models.VotesForQuestions);
	}

	findVotesForQuestionByQuery(queryObj) {

		let includeObj = queryObj.voter_id ? null : [{
			model: models.Users
		}];

	    let queryVoteType = queryObj.vote_type ? {
		    	vote_type: queryObj.vote_type
		    } : true;

		let queryQuestionId = queryObj.question_id ? {
				question_id: queryObj.question_id
			} : true;

        let queryVoterId = queryObj.voter_id ? {
	        	createdBy: queryObj.voter_id
	        } : true;

		let filterObj = Sequelize.and(
			queryVoteType,
			queryQuestionId,
			queryVoterId
			);

		return this.findEntriesFromModel(null, includeObj, filterObj, null, queryObj.limit, queryObj.offset);
	}

	deleteVoteForQuestionByContent(voteObj) {
		return new Promise((resolve, reject) => {
			let model = this. model;
			model.destroy({
				where: voteObj,
				limit: 1
			}).then(response => {
				if (response === 1) {
                	cLogger.say(`Deleted entry with vote_type '${voteObj.vote_type}', question_id '${voteObj.question_id}' subject_id '${voteObj.subject_id}' and createdBy '${voteObj.createdBy}' from ${model.name}`);
                    resolve("OK");
                } else if (response === 0) {
                	cLogger.debug(`Unable to delete nonexistent entry with vote_type '${voteObj.vote_type}', question_id '${voteObj.question_id}' subject_id '${voteObj.subject_id}' and createdBy '${voteObj.createdBy}' in ${model.name}`);
                    reject(new APIError(`Entry with vote_type '${voteObj.vote_type}', question_id '${voteObj.question_id}' subject_id '${voteObj.subject_id}' and createdBy '${voteObj.createdBy}' Not Found in ${model.name}`, httpStatus.NOT_FOUND));
                } else { // should never happen
                	reject(new APIError('Deleted multiple entries, which should never happen', httpStatus.INTERNAL_SERVER_ERROR));
                }
			}).catch(err => {
            	cLogger.debug(`ERROR deleting entry : SQL ${err.message} ${JSON.stringify(err.errors)}`);
                reject(new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR));
            });
		});
	}

}

module.exports = VotesForQuestionsHandler;
