/*
* @Author: KaileDing
* @Date:   2017-06-05 14:02:16
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-16 10:38:57
*/

'use strict';
import express from 'express';
const router = express.Router();
import httpStatus from 'http-status'
import dbConnectionPool from '../data/DBConnection'
import dbInitialization from '../data/DBInitialization'
import models from '../models/Model_Index'
import APIError from '../helpers/APIError'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();

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

module.exports = router;