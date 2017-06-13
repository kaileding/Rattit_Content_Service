/*
* @Author: KaileDing
* @Date:   2017-06-12 16:46:47
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-12 16:48:37
*/

'use strict';
import express from 'express';
const router = express.Router();
import requestInterceptor from '../interceptors/RequestInterceptor'
import commentForAnswersController from '../controllers/CommentForAnswersController'

router.use('/', requestInterceptor);

router.post('/', commentForAnswersController.postCommentForAnAnswer);

router.get('/', commentForAnswersController.getCommentsForAnswerByQuery);

router.get('/:id', commentForAnswersController.getCommentForAnswerById);

router.delete('/:id', commentForAnswersController.deleteCommentForAnswer);

router.patch('/:id/voters/:voterId', commentForAnswersController.castOrChangeVoteForCommentForAnswer);

module.exports = router;