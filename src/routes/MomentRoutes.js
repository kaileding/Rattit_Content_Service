/*
* @Author: KaileDing
* @Date:   2017-06-07 18:24:43
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-11 02:23:27
*/

'use strict';
import express from 'express';
const router = express.Router();
import requestInterceptor from '../interceptors/RequestInterceptor'
import momentsController from '../controllers/MomentsController'

router.use('/', requestInterceptor);

router.post('/', momentsController.postMoment);

router.patch('/:id', momentsController.updateMoment);

router.post('/:id/likers', momentsController.likeAMoment);

router.delete('/:id/likers/:likerId', momentsController.notLikeAMoment);

router.post('/:id/admirers', momentsController.appreciateAMoment);

router.delete('/:id/admirers/:admirerId', momentsController.notAppreciateAMoment);


module.exports = router;