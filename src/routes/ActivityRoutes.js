/*
 * @Author: Kaile Ding 
 * @Date: 2017-08-06 20:04:07 
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-06 20:06:20
 */

'use strict';
import express from 'express';
const router = express.Router();
import requestInterceptor from '../interceptors/RequestInterceptor'
import activitiesController from '../controllers/ActivitiesController'

router.use('/', requestInterceptor);

router.get('/', activitiesController.getActivityFeedOfAUser);

module.exports = router;