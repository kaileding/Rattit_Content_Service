/*
 * @Author: Kaile Ding 
 * @Date: 2017-08-06 20:04:46 
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-10 00:52:54
 */

'use strict';
import httpStatus from 'http-status'
import Promise from 'bluebird'
import votesRequestValidator from '../Validators/VotesRequestValidator'
import UserRelationshipsHandler from '../handlers/UserRelationshipsHandler'
import DynamoDBHandler from '../handlers/DynamoDBHandler'
import DynamoFeedsHandler from '../handlers/DynamoFeedsHandler'
import models from '../models/Model_Index'
import ActivityFeedsUtils from '../helpers/ActivityFeedsUtils'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();
let userRelationshipsHandler = new UserRelationshipsHandler();
let dynamoDBHandler = new DynamoDBHandler();
let feedsHandler = new DynamoFeedsHandler();

module.exports = {

    getActivityFeedOfAUser: function(req, res, next) {
        votesRequestValidator.validateGetVotesForAnswersByQueryRequest(req).then(result => {

            // return dynamoDBHandler.insertActivityToFeedsOfFollowers({
            //     actor: 'actor 1',
            //     action: 'post',
            //     target: 'moment:1001',
            //     actionTime: '2017-08-07T08:21:40.276Z'
            // }, [
            //     'recipient 1',
            //     'recipient 2',
            //     'recipient 3'
            // ]).then(results => {
            //     res.status(httpStatus.OK).send(results);
            // }).catch(error => {
            //     next(error);
            // });

            // return dynamoDBHandler.insertActivityToFeedsOfFollowers({
            //     actor: 'actor 2',
            //     action: 'post',
            //     target: 'moment:1002',
            //     actionTime: '2017-08-07T08:21:45.276Z'
            // }, [
            //     'recipient 2',
            //     'recipient 3'
            // ]).then(results => {
            //     res.status(httpStatus.OK).send(results);
            // }).catch(error => {
            //     next(error);
            // });

            // return dynamoDBHandler.insertActivityToFeedsOfFollowers({
            //     actor: 'actor 1',
            //     action: 'post',
            //     target: 'moment:1003',
            //     actionTime: '2017-08-07T08:22:06.276Z'
            // }, [
            //     'recipient 1',
            //     'recipient 2'
            // ]).then(results => {
            //     res.status(httpStatus.OK).send(results);
            // }).catch(error => {
            //     next(error);
            // });

            // return dynamoDBHandler.insertActivityToHotTable({
            //     hotType: 'Public',
            //     actor: 'actor 1',
            //     action: 'post',
            //     target: 'moment:1007',
            //     actionTime: '2017-08-08T08:22:06.276Z'
            // }).then(results => {
            //     res.status(httpStatus.OK).send(results);
            // }).catch(error => {
            //     next(error);
            // });

            return feedsHandler.getLastFewRecordsFromFeed(req.user_id, 10).then(results => {
                return ActivityFeedsUtils.enrichActivityFeed(results.Items).then(enrichRes => {
                    res.status(httpStatus.OK).send(enrichRes);
                }).catch(error => {
                    next(error);
                });
            }).catch(error => {
                next(error);
            });

        }).catch(error => {
			next(error);
		})
    }

}