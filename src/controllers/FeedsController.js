/*
 * @Author: Kaile Ding 
 * @Date: 2017-08-06 20:04:46 
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-12 03:57:45
 */

'use strict';
import httpStatus from 'http-status'
import Promise from 'bluebird'
import feedsRequestValidator from '../Validators/ActivityFeedRequestValidator'
import UserRelationshipsHandler from '../handlers/UserRelationshipsHandler'
import DynamoDBHandler from '../handlers/DynamoDBHandler'
import DynamoFeedsHandler from '../handlers/DynamoFeedsHandler'
import DynamoActivitiesHandler from '../handlers/DynamoActivitiesHandler'
import DynamoHotPostsHandler from '../handlers/DynamoHotPostsHandler'
import DynamoNotificationsHandler from '../handlers/DynamoNotificationsHandler'
import models from '../models/Model_Index'
import ActivityFeedsUtils from '../helpers/ActivityFeedsUtils'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();
let userRelationshipsHandler = new UserRelationshipsHandler();
let dynamoDBHandler = new DynamoDBHandler();
let feedsHandler = new DynamoFeedsHandler();
let activitiesHandler = new DynamoActivitiesHandler();
let hotPostsHandler = new DynamoHotPostsHandler();
let notificationsHandler = new DynamoNotificationsHandler();

module.exports = {

    getActivityFeedOfAUser: function(req, res, next) {
        feedsRequestValidator.validateGetContentFeedRequest(req).then(validationRes => {

            var asyncReqs = [];
            asyncReqs.push(userRelationshipsHandler.findFollowingIdsByUserId(req.user_id));
            if (req.query.upto_time) {
                asyncReqs.push(feedsHandler.getFewMoreRecordsFromFeed(req.user_id, 3, req.query.upto_time));
                asyncReqs.push(hotPostsHandler.getFewMoreRecordsFromHotTable('Popular', 3, req.query.upto_time));
                asyncReqs.push(hotPostsHandler.getFewMoreRecordsFromHotTable('Public', 3, req.query.upto_time));
            } else {
                asyncReqs.push(feedsHandler.getLastFewRecordsFromFeed(req.user_id, 3));
                asyncReqs.push(hotPostsHandler.getLastFewRecordsFromHotTable('Popular', 3));
                asyncReqs.push(hotPostsHandler.getLastFewRecordsFromHotTable('Public', 3));
            }
            return Promise.all(asyncReqs).then(reqsResults => {
                // res.status(httpStatus.OK).send(reqsResults);
                var fetchedRes = {};
                if (reqsResults[1].Count > 0) {
                    fetchedRes.feedResults = reqsResults[1].Items;
                }
                if (reqsResults[2].Count > 0) {
                    fetchedRes.popularResults = reqsResults[2].Items;
                }
                if (reqsResults[3].Count > 0) {
                    fetchedRes.publicResults = reqsResults[3].Items;
                }
                let sortedResults = ActivityFeedsUtils.cleanAndSortFetchedItems(fetchedRes, reqsResults[0].followingIds);
                // res.status(httpStatus.OK).send({
                //     reqResult: reqsResults,
                //     sortedResult: sortedResults
                // });

                return ActivityFeedsUtils.enrichActivityFeed(sortedResults.ReturnedActivities).then(enrichRes => {
                    res.status(httpStatus.OK).send({
                        Items: enrichRes,
                        LeftTimeBound: sortedResults.LeftTimeBound,
                        RightTimeBound: sortedResults.RightTimeBound
                    });
                }).catch(error => {
                    next(error);
                });
            }).catch(reqsError => {
                next(reqsError);
            });

        }).catch(error => {
			next(error);
		});
    },

    getNotificationFeedOfAUser: function(req, res, next) {
        feedsRequestValidator.validateGetContentFeedRequest(req).then(validationRes => {

            var asyncReq = null;
            if (req.query.upto_time) {
                asyncReq = notificationsHandler.getFewMoreRecordsFromNotificationTable(req.user_id, 2, req.query.upto_time);
            } else if (req.query.all_unread) {
                asyncReq = notificationsHandler.getAllUnreadItemsFromNotificationTable(req.user_id);
            } else {
                asyncReq = notificationsHandler.getLastFewRecordsFromNotificationTable(req.user_id, 2);
            }
            return asyncReq.then(fetchRes => {
                res.status(httpStatus.OK).send(fetchRes);

                // return ActivityFeedsUtils.enrichActivityFeed(sortedResults.ReturnedActivities).then(enrichRes => {
                //     res.status(httpStatus.OK).send({
                //         Items: enrichRes,
                //         LeftTimeBound: sortedResults.LeftTimeBound,
                //         RightTimeBound: sortedResults.RightTimeBound
                //     });
                // }).catch(error => {
                //     next(error);
                // });
            }).catch(reqsError => {
                next(reqsError);
            });

        }).catch(error => {
			next(error);
		});
    }

}