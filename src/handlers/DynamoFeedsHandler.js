/*
 * @Author: Kaile Ding 
 * @Date: 2017-08-09 22:05:12 
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-09 22:33:09
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

class DynamoFeedsHandler {

    insertActivityToFeedsOfFollowers(activityObj, followerIds) {
        if (followerIds.length == 0) {
            return new Promise((resolve, reject) => {
                resolve({
                    UnprocessedItems: {}
                });
            });
        } else if (followerIds.length > 25) {
            return new Promise((resolve, reject) => {
                let errorMessage = 'BAD_REQUEST, followerIds array has ' 
                                    + followerIds.length 
                                    + ' elements, batchWriteItem() func only accecpt up to 25 requests.';
                reject(new APIError(errorMessage));
            });
        }

        var newItems = [];
        followerIds.forEach(followerId => {
            newItems.push({
                PutRequest: {
                    Item: {
                        Recipient: {
                            S: followerId
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
                        }
                    }
                }
            });
        });
        var params = {
            RequestItems: {
                Feed: newItems
            },
            ReturnItemCollectionMetrics: 'SIZE',
            ReturnConsumedCapacity: 'TOTAL'
        };
        return new Promise((resolve, reject) => {
            dynamodb.batchWriteItem(params, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
    }

    getLastFewRecordsFromFeed(recipientId, numOfRecords) {
        var params = {
            TableName: 'Feed',
            ReturnConsumedCapacity: 'TOTAL',
            ScanIndexForward: false,
            KeyConditionExpression: 'Recipient = :rId',
            ExpressionAttributeValues: {
                ':rId': {
                    S: recipientId
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

    copyRecordsFromAuthorToRecipient(authorId, recipientId) {
        var readParams = {
            TableName: 'Activity',
            ReturnConsumedCapacity: 'TOTAL',
            ScanIndexForward: false,
            KeyConditionExpression: 'Actor = :aId',
            ExpressionAttributeValues: {
                ':aId': {
                    S: authorId
                }
            }
        };
        return new Promise((resolve, reject) => {
            dynamodb.query(readParams, (readError, readData) => {
                if (readError) {
                    reject(readError);
                } else {
                    var newItems = [];
                    _.forEach(readData.Items, item => {
                        if (newItems.length < 25) {
                            item.Recipient = {
                                S: recipientId
                            };
                            newItems.push({
                                PutRequest: {
                                    Item: item
                                }
                            });
                        } else {
                            return false;
                        }
                    });
                    var params = {
                        RequestItems: {
                            Feed: newItems
                        },
                        ReturnItemCollectionMetrics: 'SIZE',
                        ReturnConsumedCapacity: 'TOTAL'
                    };
                    dynamodb.batchWriteItem(params, (writeError, writeData) => {
                        if (writeError) {
                            reject(writeError);
                        } else {
                            resolve(writeData);
                        }
                    });
                }
            });
        });
    }

}

module.exports = DynamoFeedsHandler;
