/*
* @Author: KaileDing
* @Date:   2017-06-11 23:46:40
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-11 23:50:02
*/

'use strict';
import express from 'express';
const router = express.Router();
import requestInterceptor from '../interceptors/RequestInterceptor'
import answersController from '../controllers/AnswersController'

router.use('/', requestInterceptor);

router.post('/', answersController.postAnswer);

router.get('/', answersController.getAnswersByQuery);

router.get('/:id', answersController.getAnswerById);

router.patch('/:id', answersController.updateAnswer);

router.delete('/:id', answersController.deleteAnswer);

router.patch('/:id/voters/:voterId', answersController.castOrChangeVoteForAnswer);

module.exports = router;