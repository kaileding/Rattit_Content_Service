/*
 * @Author: Kaile Ding 
 * @Date: 2017-08-12 14:50:44 
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-12 17:03:21
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
import CommentForAnswersHandler from '../handlers/CommentForAnswersHandler'
import CommentForMomentsHandler from '../handlers/CommentForMomentsHandler'
import VotesForMomentsHandler from '../handlers/VotesForMomentsHandler'
import LocationsHandler from '../handlers/LocationsHandler'
import models from '../models/Model_Index'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();
let momentsHandler = new MomentsHandler();
let questionsHandler = new QuestionsHandler();
let answersHandler = new AnswersHandler();
let usersHandler = new UsersHandler();
let commentForAnswersHandler = new CommentForAnswersHandler();
let commentForMomentsHandler = new CommentForMomentsHandler();


module.exports = {

    cleanAndSortFetchedItems: function(fetchedResults) {
        if (fetchedResults.length > 0) {
            fetchedResults = fetchedResults.sort((n1, n2) => {
                return n1.ActionTime.S < n2.ActionTime.S;
            });
            let leftTimeBound = fetchedResults[fetchedResults.length-1].ActionTime.S;
            let rightTimeBound = fetchedResults[0].ActionTime.S;

            return {
                ReturnedNotifications: fetchedResults,
                LeftTimeBound: leftTimeBound,
                RightTimeBound: rightTimeBound
            };
        } else {
            return {
                ReturnedNotifications: [],
                LeftTimeBound: null,
                RightTimeBound: null
            };
        }
    },

    enrichNotificationFeed: function(feedList) {
        if (feedList.length == 0) {
            return Promise.resolve([]);
        }
        
        var momentIds = [];
        var questionIds = [];
        var answerIds = [];
        var userIds = [];
        var commentForMomentIds = [];
        var commentForAnswerIds = [];
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
                    if (feedItem.AssociateInfo && feedItem.AssociateInfo.M.invitedUserId) {
                        let invitedUserId = feedItem.AssociateInfo.M.invitedUserId.S.split(':')[1];
                        if (userIds.indexOf(invitedUserId) === -1) {
                            userIds.push(invitedUserId);
                        }
                    }
                    break;
                case 'answer':
                    if (answerIds.indexOf(contentId) === -1) {
                        answerIds.push(contentId);
                    }
                    break;
                case 'comment_for_moment':
                    if (commentForMomentIds.indexOf(contentId) === -1) {
                        commentForMomentIds.push(contentId);
                    }
                    break;
                case 'comment_for_answer':
                    if (commentForAnswerIds.indexOf(contentId) === -1) {
                        commentForAnswerIds.push(contentId);
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
            queryTypes.push('rattit_user');
        }
        if (commentForMomentIds.length > 0) {
            queries.push(commentForMomentsHandler.findEntriesByIdsFromModel(commentForMomentIds));
            queryTypes.push('comment_for_moment');
        }
        if (commentForAnswerIds.length > 0) {
            queries.push(commentForAnswersHandler.findEntriesByIdsFromModel(commentForAnswerIds));
            queryTypes.push('comment_for_answer');
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
                    Actor: contentDic['rattit_user:'+feedItem.Actor.S],
                    Action: feedItem.Action.S,
                    TargetType: feedItem.Target.S.split(':')[0],
                    Target: contentDic[feedItem.Target.S],
                    ActionTime: feedItem.ActionTime.S,
                    ReadOrNot: (feedItem.ReadOrNot.S === 'true')
                };
                if (feedItem.AssociateInfo && feedItem.AssociateInfo.M.invitedUserId) {
                    richItem.AssociateInfo = {
                        invitedUserId: contentDic[feedItem.AssociateInfo.M.invitedUserId.S]
                    }
                }
                formattedFeedList.push(richItem);
            })
            return formattedFeedList;
        });
    }
}