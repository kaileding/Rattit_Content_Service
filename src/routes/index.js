/*
* @Author: KaileDing
* @Date:   2017-05-29 10:52:48
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-10 01:13:59
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
import commentForMomentRoutes from './CommentForMomentRoutes'
import questionRoutes from './QuestionRoutes'
import answerRoutes from './AnswerRoutes'
import commentForAnswerRoutes from './CommentForAnswerRoutes'
import collectionRoutes from './CollectionRoutes'
import utilityRoutes from './UtilityRoutes'
import voteRoutes from './VoteRoutes'
import activityRoutes from './ActivityRoutes'

router.use('/', (req, res, next) => {
	cLogger.println('Called ['+req.method+'] '+req.url);
	next();
});

router.get('/ping', (req, res) =>
    res.status(httpStatus.OK).send({success: true})
);

router.use('/db', dbRoutes);

router.use('/locations', placeRoutes);

router.use('/users', userRoutes);

router.use('/moments', momentRoutes);

router.use('/comments_for_moment', commentForMomentRoutes);

router.use('/questions', questionRoutes);

router.use('/answers', answerRoutes);

router.use('/comments_for_answer', commentForAnswerRoutes);

router.use('/collections', collectionRoutes);

router.use('/utilities', utilityRoutes);

router.use('/votes', voteRoutes);

router.use('/feeds', activityRoutes);

module.exports = router;
