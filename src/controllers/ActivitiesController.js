/*
 * @Author: Kaile Ding 
 * @Date: 2017-08-06 20:04:46 
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-10 22:27:27
 */

'use strict';
import httpStatus from 'http-status'
import Promise from 'bluebird'
import votesRequestValidator from '../Validators/VotesRequestValidator'
import UserRelationshipsHandler from '../handlers/UserRelationshipsHandler'
import DynamoDBHandler from '../handlers/DynamoDBHandler'
import DynamoFeedsHandler from '../handlers/DynamoFeedsHandler'
import DynamoActivitiesHandler from '../handlers/DynamoActivitiesHandler'
import models from '../models/Model_Index'
import ActivityFeedsUtils from '../helpers/ActivityFeedsUtils'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();
let userRelationshipsHandler = new UserRelationshipsHandler();
let dynamoDBHandler = new DynamoDBHandler();
let feedsHandler = new DynamoFeedsHandler();
let activitiesHandler = new DynamoActivitiesHandler();

module.exports = {

    getActivityFeedOfAUser: function(req, res, next) {
        votesRequestValidator.validateGetVotesForAnswersByQueryRequest(req).then(result => {

            var asyncReqs = [];
            asyncReqs.push(userRelationshipsHandler.findFollowingIdsByUserId(req.user_id));
            asyncReqs.push(feedsHandler.getLastFewRecordsFromFeed(req.user_id, 10));
            asyncReqs.push(activitiesHandler.getLastFewRecordsFromHotTable('Popular', 10));
            asyncReqs.push(activitiesHandler.getLastFewRecordsFromHotTable('Public', 10));
            return Promise.all(asyncReqs).then(reqsResults => {
                // res.status(httpStatus.OK).send(reqsResults);
                let sortedItems = ActivityFeedsUtils.sortFetchedItems({
                    feedResults: reqsResults[1],
                    popularResults: reqsResults[2],
                    publicResults: reqsResults[3]
                }, reqsResults[0].followingIds);
                // res.status(httpStatus.OK).send(sortedItems);

                return ActivityFeedsUtils.enrichActivityFeed(sortedItems).then(enrichRes => {
                    res.status(httpStatus.OK).send(enrichRes);
                }).catch(error => {
                    next(error);
                });
            }).catch(reqsError => {
                next(reqsError);
            });

            // return feedsHandler.getLastFewRecordsFromFeed(req.user_id, 10).then(results => {
            //     return ActivityFeedsUtils.enrichActivityFeed(results.Items).then(enrichRes => {
            //         res.status(httpStatus.OK).send(enrichRes);
            //     }).catch(error => {
            //         next(error);
            //     });
            // }).catch(error => {
            //     next(error);
            // });

        }).catch(error => {
			next(error);
		})
    }

}