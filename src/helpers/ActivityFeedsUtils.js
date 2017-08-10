/*
 * @Author: Kaile Ding 
 * @Date: 2017-08-06 19:06:59 
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-09 22:44:09
 */

'use strict';
import httpStatus from 'http-status'
import Promise from 'bluebird'
import _ from 'lodash'
import consts from '../config/Constants'
import MomentsHandler from '../handlers/MomentsHandler'
import QuestionsHandler from '../handlers/QuestionsHandler'
import AnswersHandler from '../handlers/AnswersHandler'
import UsersHandler from '../handlers/UsersHandler'
import VotesForMomentsHandler from '../handlers/VotesForMomentsHandler'
import LocationsHandler from '../handlers/LocationsHandler'
import ActivitiesHandler from '../handlers/ActivitiesHandler'
import models from '../models/Model_Index'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();
let momentsHandler = new MomentsHandler();
let questionsHandler = new QuestionsHandler();
let answersHandler = new AnswersHandler();
let usersHandler = new UsersHandler();

module.exports = {
    insertNewActivity: function(actor, action, target) {
        
    },

    enrichActivityFeed: function(feedList) {
        var momentIds = [];
        var questionIds = [];
        var answerIds = [];
        var userIds = [];
        feedList.forEach(feedItem => {
            if (userIds.indexOf(feedItem.actor) === -1) {
                userIds.push(feedItem.actor);
            }
            let targetSplits = feedItem.target.split(':');
            let contentType = targetSplits[0];
            let contentId = targetSplits[1];
            switch (contentType) {
                case 'moment':
                    if (momentIds.indexOf(contentId) === -1) {
                        momentIds.push(contentId);
                    }
                    break;
                case 'question':
                    if (questionIds.indexOf(contentId) === -1) {
                        questionIds.push(contentId);
                    }
                    break;
                case 'answer':
                    if (answerIds.indexOf(contentId) === -1) {
                        answerIds.push(contentId);
                    }
                    break;
                default:
                    break;
            }
        });
        var queries = [];
        if (momentIds.length > 0) {
            queries.push(momentsHandler.findEntriesByIdsFromModel(momentIds));
        }
        if (questionIds.length > 0) {
            queries.push(questionsHandler.findEntriesByIdsFromModel(questionIds));
        }
        if (answerIds.length > 0) {
            queries.push(answersHandler.findEntriesByIdsFromModel(answerIds));
        }
        return Promise.all(queries).then(results => {
            return results;
        });
    }
}