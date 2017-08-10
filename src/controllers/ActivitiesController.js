/*
 * @Author: Kaile Ding 
 * @Date: 2017-08-06 20:04:46 
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-09 16:06:25
 */

'use strict';
import httpStatus from 'http-status'
import Promise from 'bluebird'
import votesRequestValidator from '../Validators/VotesRequestValidator'
import UserRelationshipsHandler from '../handlers/UserRelationshipsHandler'
import DynamoDBHandler from '../handlers/DynamoDBHandler'
import models from '../models/Model_Index'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();
let userRelationshipsHandler = new UserRelationshipsHandler();
let dynamoDBHandler = new DynamoDBHandler();

module.exports = {

    getActivityFeedOfAUser: function(req, res, next) {
        votesRequestValidator.validateGetVotesForAnswersByQueryRequest(req).then(result => {

            // return userRelationshipsHandler.findFollowerIdsByUserId(req.user_id).then(results => {
            //     res.status(httpStatus.OK).send(results);
            // }).catch(error => {
            //     next(error);
            // });

            // return dynamoDBHandler.initializeDynamoDBTables().then(results => {
            //     res.status(httpStatus.OK).send(results);
            // }).catch(error => {
            //     next(error);
            // });

            // return dynamoDBHandler.setTTLtoTable('HotPost').then(results => {
            //     res.status(httpStatus.OK).send(results);
            // }).catch(error => {
            //     next(error);
            // });

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

            return dynamoDBHandler.insertActivityToHotTable({
                hotType: 'Public',
                actor: 'actor 1',
                action: 'post',
                target: 'moment:1007',
                actionTime: '2017-08-08T08:22:06.276Z'
            }).then(results => {
                res.status(httpStatus.OK).send(results);
            }).catch(error => {
                next(error);
            });

            // return dynamoDBHandler.getLastFewRecordsFromFeed('recipient 2', 2).then(results => {
            //     res.status(httpStatus.OK).send(results);
            // }).catch(error => {
            //     next(error);
            // });

        }).catch(error => {
			next(error);
		})
    }

}