/*
 * @Author: Kaile Ding 
 * @Date: 2017-08-09 22:05:12 
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-10 21:36:33
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

    createBatchWriteRequestToFeedTable(requestList) {
        var params = {
            RequestItems: {
                Feed: requestList
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

    createMultipleBatchWriteRequestsToFeedTable(loopArr, requestBuilder) {
        if (loopArr.length == 0) {
            return new Promise((resolve, reject) => {
                resolve({
                    UnprocessedItems: {}
                });
            });
        }

        var batchWriteReqs = [];
        var newItems = [];
        var itemCount = 0;
        loopArr.forEach(arrElement => {
            let oneReq = requestBuilder(arrElement);
            newItems.push(oneReq);
            itemCount ++;
            if (itemCount%25 == 0) {
                batchWriteReqs.push(newItems);
                newItems = [];
            }
        });
        if (newItems.length > 0) {
            batchWriteReqs.push(newItems);
        }

        var batchWriteReqPromises = [];
        batchWriteReqs.forEach(reqSet => {
            batchWriteReqPromises.push(this.createBatchWriteRequestToFeedTable(reqSet));
        });

        return Promise.all(batchWriteReqPromises).then(results => {
            return results;
        }).catch(error => {
            throw new APIError('Unable to perform DynamoDB batchWriteItem calls');
        });
    }

    insertActivityToFeedsOfFollowers(activityObj, followerIds) {
        return this.createMultipleBatchWriteRequestsToFeedTable(followerIds, (followerId) => {
            return {
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
                            S: String(activityObj.actionTime.getTime())
                        }
                    }
                }
            };
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

    copyRecordsFromAuthorToRecipient(authorId, numOfRecords, recipientId) {
        var readParams = {
            TableName: 'Activity',
            ReturnConsumedCapacity: 'TOTAL',
            ScanIndexForward: false,
            KeyConditionExpression: 'Actor = :aId',
            ExpressionAttributeValues: {
                ':aId': {
                    S: authorId
                }
            },
            Limit: numOfRecords
        };
        return new Promise((resolve, reject) => {
            dynamodb.query(readParams, (readError, readData) => {
                if (readError) {
                    reject(readError);
                } else {
                    this.createMultipleBatchWriteRequestsToFeedTable(readData.Items, (activity) => {
                        activity.Recipient = {
                            S: recipientId
                        };
                        return {
                            PutRequest: {
                                Item: activity
                            }
                        };
                    }).then(writeRes => {
                        resolve(writeRes);
                    }).catch(writeError => {
                        reject(writeError);
                    });
                }
            });
        });
    }

    removeRecordsOfAuthorFromRecipientFeed(authorId, recipientId) {
        var readParams = {
            TableName: 'Feed',
            IndexName: 'Feed_GSI_on_Actor',
            ReturnConsumedCapacity: 'TOTAL',
            ScanIndexForward: false,
            KeyConditionExpression: 'Recipient = :rId AND Actor = :aId',
            ExpressionAttributeValues: {
                ':rId': {
                    S: recipientId
                },
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
                    this.createMultipleBatchWriteRequestsToFeedTable(readData.Items, (activity) => {
                        return {
                            DeleteRequest: {
                                Key: {
                                    Recipient: activity.Recipient,
                                    ActionTime: activity.ActionTime
                                }
                            }
                        };
                    }).then(writeRes => {
                        resolve(writeRes);
                    }).catch(writeError => {
                        reject(writeError);
                    });
                }
            });
        });
    }

}

module.exports = DynamoFeedsHandler;
