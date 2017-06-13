/*
* @Author: KaileDing
* @Date:   2017-06-13 01:49:07
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-13 02:02:06
*/

'use strict';
import express from 'express';
const router = express.Router();
import requestInterceptor from '../interceptors/RequestInterceptor'
import collectionsController from '../controllers/CollectionsController'

router.use('/', requestInterceptor);

router.post('/', collectionsController.createCollection);

router.get('/', collectionsController.getCollectionsByQuery);

router.get('/:id', collectionsController.getCollectionById);

router.patch('/:id', collectionsController.updateCollection);

router.delete('/:id', collectionsController.deleteCollection);


router.get('/:id/questions', collectionsController.findQuestionsOfCollection);

router.patch('/:id/questions', collectionsController.addQuestionIntoCollection);

router.delete('/:id/questions/:contentId', collectionsController.removeQuestionFromCollection);

router.get('/:id/answers', collectionsController.findAnswersOfCollection);

router.patch('/:id/answers', collectionsController.addAnswerIntoCollection);

router.delete('/:id/answers/:contentId', collectionsController.removeAnswerFromCollection);

router.get('/:id/moments', collectionsController.findMomentsOfCollection);

router.patch('/:id/moments', collectionsController.addMomentIntoCollection);

router.delete('/:id/moments/:contentId', collectionsController.removeMomentFromCollection);

module.exports = router;