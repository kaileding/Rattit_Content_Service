/*
 * @Author: Kaile Ding 
 * @Date: 2017-08-08 14:31:33 
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-10 01:08:06
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

class DynamoDBHandler {
    
    describeOneTable(tableName) {
        return new Promise((resolve, reject) => {
            dynamodb.describeTable({
                TableName: tableName
            }, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
    }

    describeExistingTables() {
        return new Promise((resolve, reject) => {
            dynamodb.listTables({}, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    cLogger.say('Existing tables: ', data);
                    resolve(data.TableNames);
                }
            })
        }).then(tableNames => {
            var describeReqs = [];
            tableNames.forEach(tableName => {
                describeReqs.push(this.describeOneTable(tableName));
            });
            return Promise.all(describeReqs);
        });
    }

    createOneDynamoDBTable(tableOptions) {
        return new Promise((resolve, reject) => {
            dynamodb.createTable(tableOptions, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
    }

    deleteOneDynamoDBTable(tableName) {
        return new Promise((resolve, reject) => {
            dynamodb.deleteTable({
                TableName: tableName
            }, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
    }

    createAllTablesForDynamoDB() {
        var createTableReqs = [];
        createTableReqs.push(this.createOneDynamoDBTable(dynamoModel.FeedTable));
        createTableReqs.push(this.createOneDynamoDBTable(dynamoModel.HotPostTable));
        createTableReqs.push(this.createOneDynamoDBTable(dynamoModel.ActivityTable));
        createTableReqs.push(this.createOneDynamoDBTable(dynamoModel.PendingMarkTable));
        return Promise.all(createTableReqs);
    }

    initializeDynamoDBTables() {
        return new Promise((resolve, reject) => {
            dynamodb.listTables({}, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    cLogger.say('Existing tables: ', data);
                    resolve(data.TableNames);
                }
            })
        }).then(tableNames => {
            if (tableNames.length === 0) {
                return this.createAllTablesForDynamoDB();
            } else {
                var deleteTableReqs = [];
                tableNames.forEach(tableName => {
                    deleteTableReqs.push(this.deleteOneDynamoDBTable(tableName));
                })
                return Promise.all(deleteTableReqs).then(results => {
                    return {
                        message: 'Successfully deleted tables: '+tableNames.join(', ')
                    };
                });
            }
        });
    }

    setTTLtoTable(tableName) {
        var params = {
            TableName: tableName,
            TimeToLiveSpecification: {
                AttributeName: 'ExpirationTime',
                Enabled: true
            }
        };
        return new Promise((resolve, reject) => {
            dynamodb.updateTimeToLive(params, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
    }

}

module.exports = DynamoDBHandler;
