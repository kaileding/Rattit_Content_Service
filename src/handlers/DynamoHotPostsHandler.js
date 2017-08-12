/*
 * @Author: Kaile Ding 
 * @Date: 2017-08-11 23:27:35 
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-11 23:45:12
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

class DynamoHotPostsHandler extends DynamoBaseHandler {
	constructor() {
		super('HotPost');
	}

    insertActivityToHotTable(activityObj) {
        var params = {
            TableName: 'HotPost',
            ReturnConsumedCapacity: 'TOTAL',
            Item: {
                HotType: {
                    S: activityObj.hotType
                },
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
                },
                ExpirationTime: {
                    N: String(Math.ceil(activityObj.actionTime.getTime()/1000)+259200) // expires in 3 days
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

    getLastFewRecordsFromHotTable(hotType, numOfRecords) {

        return this.queryRecordsFromTable('HotType = :hType', {
                ':hType': {
                    S: hotType
                }
            }, false, numOfRecords);
    }

    getFewMoreRecordsFromHotTable(hotType, numOfRecords, upToActionTime) {

        return this.queryRecordsFromTable('HotType = :hType AND ActionTime < :aTime', {
                ':hType': {
                    S: hotType
                },
                ':aTime': {
                    S: upToActionTime
                }
            }, false, numOfRecords);
    }

}

module.exports = DynamoHotPostsHandler;
