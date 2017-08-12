/*
 * @Author: Kaile Ding 
 * @Date: 2017-08-06 19:06:59 
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-11 23:41:27
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

    cleanAndSortFetchedItems: function(fetchedResults, followingIds) {
        if (fetchedResults.feedResults || fetchedResults.popularResults || fetchedResults.publicResults) {
            var totalActivities = [];
            var leftTimeBound = '';
            var rightTimeBound = '';
            if (fetchedResults.feedResults) {
                let items = fetchedResults.feedResults;
                totalActivities = totalActivities.concat(items);
                leftTimeBound = Math.max(leftTimeBound, items[items.length-1].ActionTime.S);
                rightTimeBound = Math.max(rightTimeBound, items[0].ActionTime.S);
            }
            if (fetchedResults.publicResults) {
                // totalActivities = totalActivities.concat(fetchedResults.publicResults);
                let items = fetchedResults.publicResults;
                totalActivities = totalActivities.concat(items);
                leftTimeBound = Math.max(leftTimeBound, items[items.length-1].ActionTime.S);
                rightTimeBound = Math.max(rightTimeBound, items[0].ActionTime.S);
            }
            if (fetchedResults.popularResults) {
                let narrowedPopularResults = filterPopularResults(fetchedResults.popularResults, followingIds);
                if (narrowedPopularResults.length > 0) {
                    totalActivities = totalActivities.concat(narrowedPopularResults);
                    leftTimeBound = Math.max(leftTimeBound, narrowedPopularResults[narrowedPopularResults.length-1].ActionTime.S);
                    rightTimeBound = Math.max(rightTimeBound, narrowedPopularResults[0].ActionTime.S);
                }
            }
            totalActivities = totalActivities.sort((a1, a2) => {
                return a1.ActionTime.S < a2.ActionTime.S;
            });
            totalActivities = totalActivities.filter(activity => {
                return (activity.ActionTime.S >= leftTimeBound);
            });

            return {
                ReturnedActivities: totalActivities,
                LeftTimeBound: ((leftTimeBound==='') ? null : String(leftTimeBound)),
                RightTimeBound: ((rightTimeBound==='') ? null : String(rightTimeBound))
            };
        } else {
            return {
                ReturnedActivities: [],
                LeftTimeBound: null,
                RightTimeBound: null
            };
        }
    },

    enrichActivityFeed: function(feedList) {
        if (feedList.length == 0) {
            return Promise.resolve([]);
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
                    if (feedItem.AssociateInfo && feedItem.AssociateInfo.M.forQuestionId) {
                        let forQuestionId = feedItem.AssociateInfo.M.forQuestionId.S.split(':')[1];
                        if (questionIds.indexOf(forQuestionId) === -1) {
                            questionIds.push(forQuestionId);
                        }
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
                var richItem = {
                    Actor: contentDic['user:'+feedItem.Actor.S],
                    Action: feedItem.Action.S,
                    TargetType: feedItem.Target.S.split(':')[0],
                    Target: contentDic[feedItem.Target.S],
                    ActionTime: feedItem.ActionTime.S
                };
                if (feedItem.AssociateInfo && feedItem.AssociateInfo.M.forQuestionId) {
                    richItem.AssociateInfo = {
                        forQuestion: contentDic[feedItem.AssociateInfo.M.forQuestionId.S]
                    }
                }
                formattedFeedList.push(richItem);
            })
            return formattedFeedList;
        });
    }
}