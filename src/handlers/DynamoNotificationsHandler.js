/*
 * @Author: Kaile Ding 
 * @Date: 2017-08-11 21:46:42 
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-12 04:01:36
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

class DynamoNotificationsHandler extends DynamoBaseHandler {
	constructor() {
		super('Notification');
	}

    insertActivityToNotificationTable(activityObj) {
        var params = {
            TableName: 'Notification',
            ReturnConsumedCapacity: 'TOTAL',
            Item: {
                Recipient: {
                    S: activityObj.recipient
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
                ReadOrNot: {
                    S: 'false'
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

    getAllUnreadItemsFromNotificationTable(recipientId) {
        var readParams = {
            TableName: 'Notification',
            IndexName: 'Notification_GSI_on_ReadOrNot',
            ReturnConsumedCapacity: 'TOTAL',
            ScanIndexForward: true,
            KeyConditionExpression: 'Recipient = :rId AND ReadOrNot = :readOrNot',
            ExpressionAttributeValues: {
                ':rId': {
                    S: recipientId
                },
                ':readOrNot': {
                    S: 'false'
                }
            }
        };
        return new Promise((resolve, reject) => {
            dynamodb.query(readParams, (readError, readData) => {
                if (readError) {
                    reject(readError);
                } else {
                    resolve(readData);
                }
            });
        });
    }

    markOneItemAsRead(recipientId, actionTime) {
        var readParams = {
            TableName: 'Notification',
            Key: {
                Recipient: {
                    S: recipientId
                },
                ActionTime: {
                    S: actionTime
                }
            }
        };
        return new Promise((resolve, reject) => {
            dynamodb.getItem(readParams, (error, data) => {
                if (error) {
                    reject(error);
                } else if (data.Item) {
                    var item = data.Item;
                    item.ReadOrNot.S = 'true';
                    return dynamodb.putItem({
                        TableName: 'Notification',
                        Item: item
                    }, (modifyError, modifyRes) => {
                        if (modifyError) {
                            reject(resolve);
                        } else {
                            resolve(modifyRes);
                        }
                    });
                } else {
                    reject(new APIError('Notification Item Not Found in DynamoDB.'));
                }
            });
        });
    }

    markAllItemsAsRead(recipientId) {

        return this.getAllUnreadItemsFromNotificationTable(recipientId).then(readData => {
            return  this.createMultipleBatchWriteRequestsToTable(readData.Items, (activity) => {
                activity.ReadOrNot.S = 'true';
                return {
                    PutRequest: {
                        Item: activity
                    }
                };
            });
        });

        // var readParams = {
        //     TableName: 'Notification',
        //     IndexName: 'Notification_GSI_on_ReadOrNot',
        //     ReturnConsumedCapacity: 'TOTAL',
        //     ScanIndexForward: true,
        //     KeyConditionExpression: 'Recipient = :rId AND ReadOrNot = :readOrNot',
        //     ExpressionAttributeValues: {
        //         ':rId': {
        //             S: recipientId
        //         },
        //         ':readOrNot': {
        //             S: 'false'
        //         }
        //     }
        // };
        // return new Promise((resolve, reject) => {
        //     dynamodb.query(readParams, (readError, readData) => {
        //         if (readError) {
        //             reject(readError);
        //         } else {

        //             this.createMultipleBatchWriteRequestsToTable(readData.Items, (activity) => {
        //                 activity.ReadOrNot.S = 'true';
        //                 return {
        //                     PutRequest: {
        //                         Item: activity
        //                     }
        //                 };
        //             }).then(writeRes => {
        //                 resolve(writeRes);
        //             }).catch(writeError => {
        //                 reject(writeError);
        //             });
        //         }
        //     });
        // });
    }

    getLastFewRecordsFromNotificationTable(recipientId, numOfRecords) {

        // cLogger.debug('getLastFewRecordsFromNotificationTable() func. ', recipientId, numOfRecords);
        
        return this.queryRecordsFromTable('Recipient = :rId', {
                ':rId': {
                    S: recipientId
                }
            }, false, numOfRecords);
    }

    getFewMoreRecordsFromNotificationTable(recipientId, numOfRecords, upToActionTime) {

        return this.queryRecordsFromTable('Recipient = :rId AND ActionTime < :aTime', {
                ':rId': {
                    S: recipientId
                },
                ':aTime': {
                    S: upToActionTime
                }
            }, false, numOfRecords);
    }

}

module.exports = DynamoNotificationsHandler;