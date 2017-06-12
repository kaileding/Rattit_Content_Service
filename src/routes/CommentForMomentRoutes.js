/*
* @Author: KaileDing
* @Date:   2017-06-12 01:48:26
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-12 01:51:05
*/

'use strict';
import express from 'express';
const router = express.Router();
import requestInterceptor from '../interceptors/RequestInterceptor'
import commentForMomentsController from '../controllers/CommentForMomentsController'

router.use('/', requestInterceptor);

router.post('/', commentForMomentsController.postCommentForAMoment);

router.get('/', commentForMomentsController.getCommentsForMomentByQuery);

router.get('/:id', commentForMomentsController.getCommentForMomentById);

router.delete('/:id', commentForMomentsController.deleteCommentForMoment);

router.patch('/:id/voters/:voterId', commentForMomentsController.castOrChangeVoteForCommentForMoment);

module.exports = router;