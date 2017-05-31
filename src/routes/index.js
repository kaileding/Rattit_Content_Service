/*
* @Author: KaileDing
* @Date:   2017-05-29 10:52:48
* @Last Modified by:   kaileding
* @Last Modified time: 2017-05-31 01:58:49
*/

'use strict';
import express from 'express'
const router = express.Router();
import httpStatus from 'http-status'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();

import nearbyRoutes from './NearbyRoutes'

router.use('/', (req, res, next) => {
	cLogger.say(cLogger.ESSENTIAL_TYPE, 'Called ['+req.method+'] '+req.url);
	next();
})

router.get('/ping', (req, res) =>
    res.status(httpStatus.OK).send({success: true})
);

router.use('/nearby', nearbyRoutes);

module.exports = router;