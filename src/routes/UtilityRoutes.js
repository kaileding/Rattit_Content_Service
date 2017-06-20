/*
* @Author: KaileDing
* @Date:   2017-06-19 20:29:24
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-19 20:37:57
*/

'use strict';
import express from 'express'
const router = express.Router();
import requestInterceptor from '../interceptors/RequestInterceptor'
import utilitiesController from '../controllers/UtilitiesController'

router.use('/', requestInterceptor);

router.get('/s3/signedurl', utilitiesController.getSignedS3URL);

module.exports = router;
