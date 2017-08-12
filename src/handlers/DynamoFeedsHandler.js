/*
 * @Author: Kaile Ding 
 * @Date: 2017-08-09 22:05:12 
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-12 00:00:46
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

class DynamoFeedsHandler extends DynamoBaseHandler {
	constructor() {
		super('Feed');
	}

    insertActivityToFeedsOfFollowers(activityObj, followerIds) {

        return this.createMultipleBatchWriteRequestsToTable(followerIds, (followerId) => {
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
                        },
                        AssociateInfo: {
                            M: (activityObj.associateInfo || {})
                        }
                    }
                }
            };
        });
    }

    getLastFewRecordsFromFeed(recipientId, numOfRecords) {

        return this.queryRecordsFromTable('Recipient = :rId', {
                ':rId': {
                    S: recipientId
                }
            }, false, numOfRecords);
    }

    getFewMoreRecordsFromFeed(recipientId, numOfRecords, upToActionTime) {

        return this.queryRecordsFromTable('Recipient = :rId AND ActionTime < :aTime', {
                ':rId': {
                    S: recipientId
                },
                ':aTime': {
                    S: upToActionTime
                }
            }, false, numOfRecords);
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

                    this.createMultipleBatchWriteRequestsToTable(readData.Items, (activity) => {
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

                    this.createMultipleBatchWriteRequestsToTable(readData.Items, (activity) => {
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
