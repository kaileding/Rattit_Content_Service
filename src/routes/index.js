/*
* @Author: KaileDing
* @Date:   2017-05-29 10:52:48
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-11 21:47:27
*/

'use strict';
import express from 'express'
const router = express.Router();
import httpStatus from 'http-status'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();

import dbRoutes from './DBRoutes'
import placeRoutes from './PlaceRoutes'
import userRoutes from './UserRoutes'
import momentRoutes from './MomentRoutes'
import questionRoutes from './QuestionRoutes'

router.use('/', (req, res, next) => {
	cLogger.say(cLogger.NEWLINE_TYPE, 'Called ['+req.method+'] '+req.url);
	next();
});

router.get('/ping', (req, res) =>
    res.status(httpStatus.OK).send({success: true})
);

router.use('/db', dbRoutes);

router.use('/locations', placeRoutes);

router.use('/users', userRoutes);

router.use('/moments', momentRoutes);

router.use('/questions', questionRoutes);

module.exports = router;