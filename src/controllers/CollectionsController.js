/*
* @Author: KaileDing
* @Date:   2017-06-13 00:57:47
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-13 02:26:13
*/

'use strict';
import httpStatus from 'http-status'
import Promise from 'bluebird'
import collectionRequestValidator from '../Validators/CollectionRequestValidator'
import CollectionsHandler from '../handlers/CollectionsHandler'
import CollectAssociationsHandler from '../handlers/CollectAssociationsHandler'
import models from '../models/Model_Index'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();
let collectionsHandler = new CollectionsHandler();
let collectQuestionsHandler = new CollectAssociationsHandler(models.CollectQuestions, 'question', 'question_id');
let collectAnswersHandler = new CollectAssociationsHandler(models.CollectAnswers, 'answer', 'answer_id');
let collectMomentsHandler = new CollectAssociationsHandler(models.CollectMoments, 'moment', 'moment_id');

module.exports = {
	createCollection: function(req, res, next) {
		collectionRequestValidator.validateCreateCollectionRequest(req).then(result => {
            
            return collectionsHandler.createEntryForModel({
                    title: req.body.title,
                    description: req.body.description,
                    cover_image: req.body.cover_image,
					tags: req.body.tags,
					access_level: req.body.access_level,
					createdBy: req.user_id
                }).then(function(result) {
                    cLogger.say(cLogger.TESTING_TYPE, 'save one collection successfully.', result);
                    res.status(httpStatus.OK).send(result);
                }).catch(function(error) {
                    next(error);
                });

        }).catch(error => {
            next(error);
        });
	},

	getCollectionById: function(req, res, next) {
		collectionRequestValidator.validateGetCollectionByIdRequest(req).then(result => {

            return collectionsHandler.findEntryByIdFromModel(req.params.id).then(result => {
                    res.status(httpStatus.OK).send(result);
                }).catch(err => {
                    next(err);
                });

        }).catch(error => {
            next(error);
        });
	},

	getCollectionsByQuery: function(req, res, next) {
        collectionRequestValidator.validateGetCollectionsByQueryRequest(req).then(result => {
            cLogger.say(cLogger.TESTING_TYPE, 'req.query.text is ', req.query.text);

            let queryObj = {
                text: req.query.text,
                owner_id: req.query.owner_id
            };

            // ?????????????????   ? ? ?? ? ? ? 
            // Add query by question_id, answer_id, moment_id


            return collectionsHandler.findCollectionsByQuery(queryObj).then(results => {
                    res.status(httpStatus.OK).send(results);
                }).catch(function(error) {
                    next(error);
                });

        }).catch(error => {
            next(error);
        });
	},

	updateCollection: function(req, res, next) {
		collectionRequestValidator.validateUpdateCollectionRequest(req).then(result => {

            var updateObj = {};
            if (req.body.title) {
                updateObj.title = req.body.title;
            }
            if (req.body.description) {
                updateObj.description = req.body.description;
            }
            if (req.body.cover_image) {
                updateObj.cover_image = req.body.cover_image;
            }
            if (req.body.tags) {
                updateObj.tags = req.body.tags;
            }
            if (req.body.access_level) {
            	updateObj.access_level = req.body.access_level;
            }

            return collectionsHandler.updateEntryByIdForModel(req.params.id, updateObj).then(result => {
                    res.status(httpStatus.OK).send(result);
                }).catch(err => {
                    next(err);
                });

        }).catch(error => {
            next(error);
        });
	},

	deleteCollection: function(req, res, next) {
		collectionRequestValidator.validateGetCollectionByIdRequest(req).then(result => {

            return collectionsHandler.updateEntryByIdForModel(req.params.id, {
                deletedAt: new Date()
            }).then(result => {
            		return Promise.all([
            				collectQuestionsHandler.deleteAssociationsByCollectionID(req.params.id),
            				collectAnswersHandler.deleteAssociationsByCollectionID(req.params.id),
            				collectMomentsHandler.deleteAssociationsByCollectionID(req.params.id)
            			]).then(results => {
                    		res.status(httpStatus.OK).send(result);
            			}).catch(error => {
            				next(error);
            			})
                }).catch(err => {
                    next(err);
                });

        }).catch(error => {
            next(error);
        });
	}, 

	findQuestionsOfCollection: function(req, res, next) {
		collectionRequestValidator.validateGetCollectionByIdRequest(req).then(result => {

			return collectQuestionsHandler.findContentsByCollectionId(req.params.id, 
																		req.query.limit, 
																		req.query.offset).then(results => {
					res.status(httpStatus.OK).send(results);
			}).catch(error => {
				next(error);
			});

		}).catch(error => {
			next(error);
		});
	},

	addQuestionIntoCollection: function(req, res, next) {
		collectionRequestValidator.validateAddContentToCollectionRequest(req).then(result => {

			return collectQuestionsHandler.createEntryForModel({
				collection_id: req.params.id,
				question_id: req.body.contentId
			}).then(result => {
				res.status(httpStatus.OK).send(result);
			}).catch(error => {
				next(error);
			});

		}).catch(error => {
			next(error);
		});
	},

	removeQuestionFromCollection: function(req, res, next) {
		collectionRequestValidator.validateRemoveContentFromCollectionRequest(req).then(result => {

			return collectQuestionsHandler.removeContentFromCollection({
				collection_id: req.params.id,
				question_id: req.params.contentId
			}).then(result => {
				res.status(httpStatus.OK).send(result);
			}).catch(error => {
				next(error);
			});

		}).catch(error => {
			next(error);
		});
	},

	findAnswersOfCollection: function(req, res, next) {
		collectionRequestValidator.validateGetCollectionByIdRequest(req).then(result => {

			return collectAnswersHandler.findContentsByCollectionId(req.params.id, 
																		req.query.limit, 
																		req.query.offset).then(results => {
					res.status(httpStatus.OK).send(results);
			}).catch(error => {
				next(error);
			});

		}).catch(error => {
			next(error);
		});
	},

	addAnswerIntoCollection: function(req, res, next) {
		collectionRequestValidator.validateAddContentToCollectionRequest(req).then(result => {

			return collectAnswersHandler.createEntryForModel({
				collection_id: req.params.id,
				answer_id: req.body.contentId
			}).then(result => {
				res.status(httpStatus.OK).send(result);
			}).catch(error => {
				next(error);
			});

		}).catch(error => {
			next(error);
		});
	},

	removeAnswerFromCollection: function(req, res, next) {
		collectionRequestValidator.validateRemoveContentFromCollectionRequest(req).then(result => {

			return collectAnswersHandler.removeContentFromCollection({
				collection_id: req.params.id,
				answer_id: req.params.contentId
			}).then(result => {
				res.status(httpStatus.OK).send(result);
			}).catch(error => {
				next(error);
			});

		}).catch(error => {
			next(error);
		});
	},

	findMomentsOfCollection: function(req, res, next) {
		collectionRequestValidator.validateGetCollectionByIdRequest(req).then(result => {

			return collectMomentsHandler.findContentsByCollectionId(req.params.id, 
																		req.query.limit, 
																		req.query.offset).then(results => {
					res.status(httpStatus.OK).send(results);
			}).catch(error => {
				next(error);
			});

		}).catch(error => {
			next(error);
		});
	},

	addMomentIntoCollection: function(req, res, next) {
		collectionRequestValidator.validateAddContentToCollectionRequest(req).then(result => {

			return collectMomentsHandler.createEntryForModel({
				collection_id: req.params.id,
				moment_id: req.body.contentId
			}).then(result => {
				res.status(httpStatus.OK).send(result);
			}).catch(error => {
				next(error);
			});
		
		}).catch(error => {
			next(error);
		});
	},

	removeMomentFromCollection: function(req, res, next) {
		collectionRequestValidator.validateRemoveContentFromCollectionRequest(req).then(result => {

			return collectMomentsHandler.removeContentFromCollection({
				collection_id: req.params.id,
				moment_id: req.params.contentId
			}).then(result => {
				res.status(httpStatus.OK).send(result);
			}).catch(error => {
				next(error);
			});

		}).catch(error => {
			next(error);
		});
	}

}