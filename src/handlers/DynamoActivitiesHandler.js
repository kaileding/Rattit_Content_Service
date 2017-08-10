/*
 * @Author: Kaile Ding 
 * @Date: 2017-08-09 22:30:35 
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-09 22:41:11
 */

'use strict';
import Promise from 'bluebird'
import Sequelize from 'sequelize'
import dbConnectionPool from '../data/DBConnection'
import pgModels from '../models/Model_Index'
import dynamoModel from '../models/Dynamo_Model'
import DataModelHandler from './DataModelHandler'
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

class DynamoActivitiesHandler {

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
                    S: activityObj.actionTime
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
                    S: activityObj.actionTime
                }, 
                ExpirationTime: {
                    N: String(Math.ceil(Date.parse(activityObj.actionTime)/1000)+259200) // expires in 3 days
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
        var params = {
            TableName: 'HotPost',
            ReturnConsumedCapacity: 'TOTAL',
            ScanIndexForward: false,
            KeyConditionExpression: 'HotType = :hType',
            ExpressionAttributeValues: {
                ':hType': {
                    S: hotType
                }
            },
            Limit: numOfRecords
        };
        return new Promise((resolve, reject) => {
            dynamodb.query(params, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
    }

    getRecordsFromAuthorTableUptoTime(actorId, uptoTime, numOfRecords) {
        var params = {
            TableName: 'Activity',
            ReturnConsumedCapacity: 'TOTAL',
            ScanIndexForward: false,
            KeyConditionExpression: 'Actor = :aId AND ActionTime < :uTime',
            ExpressionAttributeValues: {
                ':aId': {
                    S: actorId
                },
                ':uTime': {
                    S: uptoTime
                }
            },
            Limit: numOfRecords
        }
        return new Promise((resolve, reject) => {
            dynamodb.query(params, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
    }

}

module.exports = DynamoActivitiesHandler;
