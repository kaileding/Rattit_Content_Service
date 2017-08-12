/*
 * @Author: Kaile Ding 
 * @Date: 2017-08-11 23:03:08 
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-11 23:29:52
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

class DynamoBaseHandler {
	constructor(tableName) {
		this.tableName = tableName;
	}

    createBatchWriteRequestToTable(requestList) {
        var params = {
            RequestItems: {},
            ReturnItemCollectionMetrics: 'SIZE',
            ReturnConsumedCapacity: 'TOTAL'
        };
        params.RequestItems[this.tableName] = requestList;
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

    createMultipleBatchWriteRequestsToTable(loopArr, requestBuilder) {
        if (loopArr.length == 0) {
            return Promise.resolve({
                    UnprocessedItems: {}
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
            batchWriteReqPromises.push(this.createBatchWriteRequestToTable(reqSet));
        });

        return Promise.all(batchWriteReqPromises).then(results => {
            return results;
        }).catch(error => {
            throw new APIError('Unable to perform DynamoDB batchWriteItem calls');
        });
    }

    queryRecordsFromTable(keyCondition, expressionAttributeValues, scanForward, numOfRecords) {
        var params = {
            TableName: this.tableName,
            ReturnConsumedCapacity: 'TOTAL',
            ScanIndexForward: scanForward,
            KeyConditionExpression: keyCondition,
            ExpressionAttributeValues: expressionAttributeValues,
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

}

module.exports = DynamoBaseHandler;
