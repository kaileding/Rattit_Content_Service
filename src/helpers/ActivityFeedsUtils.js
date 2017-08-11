/*
 * @Author: Kaile Ding 
 * @Date: 2017-08-06 19:06:59 
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-10 22:25:39
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


let filterPopularResults = function(popularResults, followingIds) {
    return popularResults.filter(activity => {
        return (followingIds.indexOf(activity.Actor.S) > -1);
    });
}

module.exports = {

    sortFetchedItems: function(fetchedResults, followingIds) {
        if (fetchedResults.feedResults || fetchedResults.popularResults || fetchedResults.publicResults) {
            var totalActivities = [];
            if (fetchedResults.feedResults) {
                totalActivities = totalActivities.concat(fetchedResults.feedResults.Items);
            }
            if (fetchedResults.publicResults) {
                totalActivities = totalActivities.concat(fetchedResults.publicResults.Items);
            }
            if (fetchedResults.popularResults) {
                let narrowedPopularResults = filterPopularResults(fetchedResults.popularResults.Items, followingIds);
                totalActivities = totalActivities.concat(narrowedPopularResults);
            }
            return totalActivities.sort((a1, a2) => {
                return a1.ActionTime.S < a2.ActionTime.S;
            });
        } else {
            return [];
        }
    },

    enrichActivityFeed: function(feedList) {
        if (feedList.length == 0) {
            return feedList;
        }
        
        var momentIds = [];
        var questionIds = [];
        var answerIds = [];
        var userIds = [];
        feedList.forEach(feedItem => {
            if (userIds.indexOf(feedItem.Actor.S) === -1) {
                userIds.push(feedItem.Actor.S);
            }
            let targetSplits = feedItem.Target.S.split(':');
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
        var queryTypes = [];
        if (momentIds.length > 0) {
            queries.push(momentsHandler.findEntriesByIdsFromModel(momentIds));
            queryTypes.push('moment');
        }
        if (questionIds.length > 0) {
            queries.push(questionsHandler.findEntriesByIdsFromModel(questionIds));
            queryTypes.push('question');
        }
        if (answerIds.length > 0) {
            queries.push(answersHandler.findEntriesByIdsFromModel(answerIds));
            queryTypes.push('answer');
        }
        if (userIds.length > 0) {
            queries.push(usersHandler.findEntriesByIdsFromModel(userIds));
            queryTypes.push('user');
        }
        return Promise.all(queries).then(results => {
            var contentDic = {};
            results.forEach((contentSet, index) => {
                let contentType = queryTypes[index];
                contentSet.forEach(content => {
                    contentDic[contentType+':'+content.id] = content;
                });
            });
            var formattedFeedList = [];
            feedList.forEach(feedItem => {
                formattedFeedList.push({
                    Actor: contentDic['user:'+feedItem.Actor.S],
                    Action: feedItem.Action.S,
                    TargetType: feedItem.Target.S.split(':')[0],
                    Target: contentDic[feedItem.Target.S],
                    ActionTime: feedItem.ActionTime.S
                });
            })
            return formattedFeedList;
        });
    }
}