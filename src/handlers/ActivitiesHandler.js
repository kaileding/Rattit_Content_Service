/*
 * @Author: Kaile Ding 
 * @Date: 2017-08-06 19:03:22 
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-10 01:06:07
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

class ActivitiesHandler extends DataModelHandler {
	constructor() {
		super(models.Activities);
	}

	updateRecipientOfAUser(actorId, recipientIds) {

        return new Promise((resolve, reject) => {
				let model = this.model;
				model.update({
                    recipients: recipientIds
                }, {
                    where: {
                        actor: actorId
                    },
                    validate: true,
                    fields: Object.keys('recipients')
                }).then((results) => {
                    cLogger.say('Updated '+results[0]+' entries in Activity table');
                    resolve(results[0]);
                }).catch(err => {
					cLogger.debug(`ERROR updating entry : SQL ${err.message} ${JSON.stringify(err.errors)}`);
					reject(new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR));
                });
	        });
    }

    findActivityFeedForUser(queryObj) {
        
        let queryActorId = queryObj.actor_id ? {
                actor: queryObj.actor_id
            } : true;

        let queryRecipientId = queryObj.recipient_id ? {
                recipients: {
                    $contains: [queryObj.recipient_id]
                }
            } : true;

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
            queryActorId,
            queryRecipientId,
            queryDate
            );

        return this.findEntriesFromModel(null, null, filterObj, null, queryObj.limit, queryObj.offset);
    }
        
}

module.exports = ActivitiesHandler;
