/*
* @Author: KaileDing
* @Date:   2017-06-05 14:02:16
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-05 14:32:07
*/

'use strict';
import express from 'express';
const router = express.Router();
import httpStatus from 'http-status'
import dbConnectionPool from '../data/DBConnection'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();

router.get('/init', (req, res, next) => {
	let forceFlag = (req.query.force && 
		(req.query.force===1 || req.query.force===true || req.query.force==='true'));
	let dbInitMsg = forceFlag ? 'Database forcely synchronized successfully' : 'Database seeded successfully';

	dbConnectionPool.sync({
		force: forceFlag
	}).then(function (r) {
        res.status(httpStatus.OK).send({
            status: "success",
            message: dbInitMsg
        });
    }, function (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            status: "failure",
            message: "Database failed to be seeded"
        });
    });
});

router.post('/locations', (req, res, next) => {
	res.status(httpStatus.OK).send("ok.");
})

module.exports = router;