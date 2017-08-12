/*
 * @Author: Kaile Ding 
 * @Date: 2017-08-06 20:04:07 
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-12 03:48:02
 */

'use strict';
import express from 'express';
const router = express.Router();
import requestInterceptor from '../interceptors/RequestInterceptor'
import feedsController from '../controllers/FeedsController'

router.use('/', requestInterceptor);

router.get('/activities', feedsController.getActivityFeedOfAUser);

router.get('/notifications', feedsController.getNotificationFeedOfAUser);

module.exports = router;