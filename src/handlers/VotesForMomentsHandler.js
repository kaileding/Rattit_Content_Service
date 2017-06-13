/*
* @Author: KaileDing
* @Date:   2017-06-11 18:54:38
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-11 19:09:30
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

class VotesForMomentsHandler extends DataModelHandler {
	constructor() {
		super(models.VotesForMoments);
	}

	deleteVoteForMomentByContent(voteObj) {
		return new Promise((resolve, reject) => {
			let model = this. model;
			model.destroy({
				where: voteObj,
				limit: 1
			}).then(response => {
				if (response === 1) {
                	cLogger.say(cLogger.GENERAL_TYPE, `Deleted entry with vote_type '${voteObj.vote_type}', moment_id '${voteObj.moment_id}' and createdBy '${voteObj.createdBy}' from ${model.name}`);
                    resolve("OK");
                } else if (response === 0) {
                	cLogger.say(cLogger.GENERAL_TYPE, `Unable to delete nonexistent entry with vote_type '${voteObj.vote_type}', moment_id '${voteObj.moment_id}' and createdBy '${voteObj.createdBy}' in ${model.name}`);
                    reject(new APIError(`Entry with vote_type '${voteObj.vote_type}', moment_id '${voteObj.moment_id}' and createdBy '${voteObj.createdBy}' Not Found in ${model.name}`, httpStatus.NOT_FOUND));
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

module.exports = VotesForMomentsHandler;
