/*
 * @Author: Kaile Ding 
 * @Date: 2017-08-06 20:04:46 
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-06 20:10:23
 */

'use strict';
import httpStatus from 'http-status'
import Promise from 'bluebird'
import votesRequestValidator from '../Validators/VotesRequestValidator'
import UserRelationshipsHandler from '../handlers/UserRelationshipsHandler'
import models from '../models/Model_Index'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();
let userRelationshipsHandler = new UserRelationshipsHandler();

module.exports = {

    getActivityFeedOfAUser: function(req, res, next) {
        votesRequestValidator.validateGetVotesForAnswersByQueryRequest(req).then(result => {

            return userRelationshipsHandler.findFollowerIdsByUserId(req.user_id).then(results => {
                res.status(httpStatus.OK).send(results);
            }).catch(error => {
                next(error);
            });

        }).catch(error => {
			next(error);
		})
    }

}