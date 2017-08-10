/*
* @Author: KaileDing
* @Date:   2017-06-05 14:02:16
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-10 00:48:09
*/

'use strict';
import express from 'express';
const router = express.Router();
import httpStatus from 'http-status'
import dbConnectionPool from '../data/DBConnection'
import dbInitialization from '../data/DBInitialization'
import models from '../models/Model_Index'
import DynamoDBHandler from '../handlers/DynamoDBHandler'
import APIError from '../helpers/APIError'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();
let dynamoDBHandler = new DynamoDBHandler();

router.get('/init', (req, res, next) => {
	let forceFlag = (req.query.force && 
		(req.query.force===1 || req.query.force===true || req.query.force==='true'));

    let createExtensionStr = 'CREATE EXTENSION IF NOT EXISTS postgis;'
                            + 'CREATE EXTENSION IF NOT EXISTS postgis_topology;';
    dbConnectionPool.query(createExtensionStr).then(result => {

        return dbConnectionPool.sync({
                force: true
            }).then(function (r) {
                if (forceFlag) {
                    return dbInitialization().then(result => {
                            res.status(httpStatus.OK).send({
                                status: "success",
                                message: 'Database forcely synchronized successfully with testing data.'
                            });
                        }).catch(error => {
                            cLogger.say(cLogger.ESSENTIAL_TYPE, error);
                            next(new APIError('Failed to insert testing data into database.'));
                        });
                    } else {
                        res.status(httpStatus.OK).send({
                            status: "success",
                            message: 'Database synchronized successfully'
                        });
                    }
                    
            }, function (err) {
                cLogger.say(cLogger.ESSENTIAL_TYPE, err);
                next(err);
            });

    }).catch(error => {
        cLogger.say(cLogger.ESSENTIAL_TYPE, error);
        next(error);
    });
	
});

router.get('/dynamo', (req, res, next) => {
	let initDB = (req.query.init && 
        (req.query.init===1 || req.query.init===true || req.query.init==='true'));
    let setTTL = (req.query.setttl && 
        (req.query.setttl===1 || req.query.setttl===true || req.query.setttl==='true'));
    
    if (initDB) {
        return dynamoDBHandler.initializeDynamoDBTables().then(results => {
            res.status(httpStatus.OK).send(results);
        }).catch(error => {
            next(error);
        });
    } else if (setTTL) {
        return dynamoDBHandler.setTTLtoTable('HotPost').then(results => {
            res.status(httpStatus.OK).send(results);
        }).catch(error => {
            next(error);
        });
    } else {
        return dynamoDBHandler.describeExistingTables().then(results => {
            res.status(httpStatus.OK).send(results);
        }).catch(error => {
            next(error);
        });
    }
       
});

module.exports = router;