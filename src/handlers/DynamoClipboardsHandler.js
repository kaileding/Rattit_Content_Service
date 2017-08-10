/*
 * @Author: Kaile Ding 
 * @Date: 2017-08-09 22:39:00 
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-09 22:40:49
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

class DynamoClipboardsHandler {

    updateLastSyncTimeInPendingTable(recipientId, actorId, newTime) {
        var params = {
            Item: {
                Recipient: {
                    S: recipientId
                }, 
                Actor: {
                    S: actorId
                },
                LastSyncTime: {
                    S: newTime
                }
            }, 
            ReturnConsumedCapacity: 'TOTAL', 
            TableName: 'PendingMark'
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

    removeActorForRecipientFromPendingTable(recipientId, actorId) {
        var params = {
            Key: {
                Recipient: {
                    S: recipientId
                }, 
                Actor: {
                    S: actorId
                }
            },
            TableName: 'PendingMark'
        }
        return new Promise((resolve, reject) => {
            dynamodb.deleteItem(params, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
    }

    lookUpLastSyncTimeInPendingTable(recipientId) {
        var params = {
            TableName: 'PendingMark',
            ReturnConsumedCapacity: 'TOTAL',
            ScanIndexForward: false,
            KeyConditionExpression: 'Recipient = :rId',
            ExpressionAttributeValues: {
                ':rId': {
                    S: recipientId
                }
            }
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
    
}

module.exports = DynamoClipboardsHandler;
