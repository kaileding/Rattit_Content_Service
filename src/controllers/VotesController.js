/*
 * @Author: Kaile Ding 
 * @Date: 2017-08-06 16:08:47 
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-06 16:33:13
 */

'use strict';
import httpStatus from 'http-status'
import Promise from 'bluebird'
import votesRequestValidator from '../Validators/VotesRequestValidator'
import VotesForAnswersHandler from '../handlers/VotesForAnswersHandler'
import VotesForMomentsHandler from '../handlers/VotesForMomentsHandler'
import VotesForQuestionsHandler from '../handlers/VotesForQuestionsHandler'
import models from '../models/Model_Index'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();
let votesForAnswersHandler = new VotesForAnswersHandler();
let votesForMomentsHandler = new VotesForMomentsHandler();
let votesForQuestionsHandler = new VotesForQuestionsHandler();

module.exports = {

    getVotesForAnswersByQuery: function(req, res, next) {
        votesRequestValidator.validateGetVotesForAnswersByQueryRequest(req).then(result => {

			let queryObj = {
				voter_id: req.query.voter_id,
				vote_type: req.query.vote_type,
				answer_id: req.query.answer_id,
				limit: req.query.limit,
				offset: req.query.offset
			};

			return votesForAnswersHandler.findVotesForAnswersByQuery(queryObj).then(results => {
				res.status(httpStatus.OK).send(results);
			}).catch(error => {
				next(error);
			});

        }).catch(error => {
			next(error);
		})
    },

    getVotesForMomentsByQuery: function(req, res, next) {
        votesRequestValidator.validateGetVotesForMomentsByQueryRequest(req).then(result => {

			let queryObj = {
				voter_id: req.query.voter_id,
				vote_type: req.query.vote_type,
				moment_id: req.query.moment_id,
				limit: req.query.limit,
				offset: req.query.offset
			};

			return votesForMomentsHandler.findVotesForMomentsByQuery(queryObj).then(results => {
				res.status(httpStatus.OK).send(results);
			}).catch(error => {
				next(error);
			});

        }).catch(error => {
            next(error);
        })
    },

    getVotesForQuestionsByQuery: function(req, res, next) {
        votesRequestValidator.validateGetVotesForQuestionsByQueryRequest(req).then(result => {

			let queryObj = {
				voter_id: req.query.voter_id,
				vote_type: req.query.vote_type,
				question_id: req.query.question_id,
				limit: req.query.limit,
				offset: req.query.offset
			};

			return votesForQuestionsHandler.findVotesForQuestionByQuery(queryObj).then(results => {
				res.status(httpStatus.OK).send(results);
			}).catch(error => {
				next(error);
			});

        }).catch(error => {
            next(error);
        })
    }

}