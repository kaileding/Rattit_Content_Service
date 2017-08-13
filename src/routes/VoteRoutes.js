/*
 * @Author: Kaile Ding 
 * @Date: 2017-08-06 16:05:29 
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-06 16:11:05
 */

'use strict';
import express from 'express'
const router = express.Router();
import requestInterceptor from '../interceptors/RequestInterceptor'
import votesController from '../controllers/VotesController'

router.use('/', requestInterceptor);

router.get('/vote_for_answer', votesController.getVotesForAnswersByQuery);

router.get('/vote_for_moment', votesController.getVotesForMomentsByQuery);

router.get('/vote_for_question', votesController.getVotesForQuestionsByQuery);

module.exports = router;