/*
* @Author: KaileDing
* @Date:   2017-06-05 14:02:16
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-07 01:38:32
*/

'use strict';
import express from 'express';
const router = express.Router();
import httpStatus from 'http-status'
import dbConnectionPool from '../data/DBConnection'
import models from '../models/Model_Index'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();

router.get('/init', (req, res, next) => {
	let forceFlag = (req.query.force && 
		(req.query.force===1 || req.query.force===true || req.query.force==='true'));
	
	dbConnectionPool.sync({
		force: true
	}).then(function (r) {
        res.status(httpStatus.OK).send({
            status: "success",
            message: 'Database forcely synchronized successfully'
        });
    }, function (err) {
    	cLogger.say(cLogger.ESSENTIAL_TYPE, err);
        next(err);
    });
});

module.exports = router;