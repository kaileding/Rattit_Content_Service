/*
 * @Author: Kaile Ding 
 * @Date: 2017-08-09 22:30:35 
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-11 23:46:02
 */

'use strict';
import Promise from 'bluebird'
import Sequelize from 'sequelize'
import dbConnectionPool from '../data/DBConnection'
import pgModels from '../models/Model_Index'
import dynamoModel from '../models/Dynamo_Model'
import DataModelHandler from './DataModelHandler'
import DynamoBaseHandler from './DynamoBaseHandler'
import rp from 'request-promise'
import httpStatus from 'http-status'
import _ from 'lodash'
import APIError from '../helpers/APIError'
import CLogger from '../helpers/CustomLogger'
import consts from '../config/Constants'
import dynamoDBConfig from '../config/DynamoDBConfig'
import aws from 'aws-sdk'
let cLogger = new CLogger();
var dynamodb = new aws.DynamoDB(dynamoDBConfig.options);

class DynamoActivitiesHandler extends DynamoBaseHandler {
	constructor() {
		super('Activity');
	}

    insertActivityToAuthorTable(activityObj) {
        var params = {
            TableName: 'Activity',
            ReturnConsumedCapacity: 'TOTAL',
            Item: {
                Actor: {
                    S: activityObj.actor
                },
                Action: {
                    S: activityObj.action
                },
                Target: {
                    S: activityObj.target
                },
                ActionTime: {
                    S: String(activityObj.actionTime.getTime())
                },
                AssociateInfo: {
                    M: (activityObj.associateInfo || {})
                }
            }
        };
        return new Promise((resolve, reject) => {
            dynamodb.putItem(params, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
    }

    getLastFewRecordsFromAuthorTable(actorId, numOfRecords) {

        return this.queryRecordsFromTable('Actor = :aId', {
                ':aId': {
                    S: actorId
                }
            }, false, numOfRecords);
    }

    getFewMoreRecordsFromAuthorTable(actorId, numOfRecords, upToActionTime) {

        return this.queryRecordsFromTable('Actor = :aId AND ActionTime < :aTime', {
                ':aId': {
                    S: actorId
                },
                ':aTime': {
                    S: upToActionTime
                }
            }, false, numOfRecords);
    }

}

module.exports = DynamoActivitiesHandler;
