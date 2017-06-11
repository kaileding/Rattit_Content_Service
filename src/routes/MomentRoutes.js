/*
* @Author: KaileDing
* @Date:   2017-06-07 18:24:43
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-11 15:47:42
*/

'use strict';
import express from 'express';
const router = express.Router();
import requestInterceptor from '../interceptors/RequestInterceptor'
import momentsController from '../controllers/MomentsController'

router.use('/', requestInterceptor);

router.post('/', momentsController.postMoment);

router.get('/', momentsController.getMomentsByQuery);

router.get('/:id', momentsController.getMomentById);

router.patch('/:id', momentsController.updateMoment);

router.delete('/:id', momentsController.deleteMoment);

router.patch('/:id/voters/:voterId', momentsController.castOrChangeVoteForMoment);

module.exports = router;