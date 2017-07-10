/*
* @Author: KaileDing
* @Date:   2017-06-10 22:28:48
* @Last Modified by:   kaileding
* @Last Modified time: 2017-07-09 17:12:09
*/

'use strict';
import Promise from 'bluebird'
import Sequelize from 'sequelize'
import dbConnectionPool from '../data/DBConnection'
import models from '../models/Model_Index'
import DataModelHandler from './DataModelHandler'
import rp from 'request-promise'
import httpStatus from 'http-status'
import APIError from '../helpers/APIError'
import CLogger from '../helpers/CustomLogger'
import consts from '../config/Constants'
let cLogger = new CLogger();

class UserRelationshipsHandler extends DataModelHandler {
	constructor() {
		super(models.UserRelationships);
	}

	findRelationshipsAndExpandUsers(options, limit, offset) {
		limit = (limit != null) ? Number(limit) : 20;
		offset = (offset != null) ? Number(offset) : 0;

		let countQueryStatement = 'SELECT count(*) '
							+ 'FROM "user_relation" LEFT JOIN "rattit_user" '
							+ 'ON "user_relation"."' + options.expandCol + '" = "rattit_user"."id" '
							+ 'WHERE "user_relation"."' + options.filterCol + '" = ' + "'" + options.filterId + "' "
							+ 'LIMIT ' + limit + ' ' 
							+ 'OFFSET ' + offset + ';';

		let queryStatement = 'SELECT "rattit_user".*, "user_relation"."createdAt" as "relation_createdAt" '
							+ 'FROM "user_relation" LEFT JOIN "rattit_user" '
							+ 'ON "user_relation"."' + options.expandCol + '" = "rattit_user"."id" '
							+ 'WHERE "user_relation"."' + options.filterCol + '" = ' + "'" + options.filterId + "' "
							+ 'ORDER BY "user_relation"."createdAt" DESC '
							+ 'LIMIT ' + limit + ' ' 
							+ 'OFFSET ' + offset + ';';

		return this.findEntriesFromModelWithSQL(countQueryStatement, queryStatement);
	}

	findFollowersByUserId(id, limit, offset) {

		let options = {
			filterCol: 'followee',
			filterId: id,
			expandCol: 'follower'
		};

		return this.findRelationshipsAndExpandUsers(options, limit, offset);
	}

	findFolloweesByUserId(id, limit, offset) {

		let options = {
			filterCol: 'follower',
			filterId: id,
			expandCol: 'followee'
		};

		return this.findRelationshipsAndExpandUsers(options, limit, offset);
	}

	findFriendsByUserId(id, limit, offset) {

		limit = (limit != null) ? Number(limit) : 20;
		offset = (offset != null) ? Number(offset) : 0;

		let countQueryStatement = 'select count(r1.*) ' 
								+ 'from user_relation u1, rattit_user r1, user_relation u2 '
								+ 'WHERE u1.follower = u2.followee '
								+ 'AND u1.followee = u2.follower '
								+ 'AND u1.followee = r1.id '
								+ 'AND u1.follower = ' + "'" + id + "'" 
								+ 'LIMIT ' + limit + ' ' 
								+ 'OFFSET ' + offset + ';';

		let queryStatement = 'SELECT r1.* '
							+ 'from user_relation u1, rattit_user r1, user_relation u2 '
							+ 'WHERE u1.follower = u2.followee '
							+ 'AND u1.followee = u2.follower '
							+ 'AND u1.followee = r1.id '
							+ 'AND u1.follower = ' + "'" + id + "'" 
							+ 'LIMIT ' + limit + ' ' 
							+ 'OFFSET ' + offset + ';';

		return this.findEntriesFromModelWithSQL(countQueryStatement, queryStatement);


	}

	deleteFolloweeByItsID(id, followeeId) {
		return new Promise((resolve, reject) => {
				let model = this.model;
				model.destroy({
                    where: {
                        follower: id,
                        followee: followeeId
                    },
                    limit: 1
                }).then(response => {
                    if (response === 1) {
                    	cLogger.say(cLogger.GENERAL_TYPE, `Deleted entry with follower_id '${id}' and followee_id '${followeeId}' from ${model.name}`);
                        resolve("OK");
                    } else if (response === 0) {
                    	cLogger.say(cLogger.GENERAL_TYPE, `Unable to delete nonexistent entry with follower_id '${id}' and followee_id '${followeeId}' in ${model.name}`);
                        reject(new APIError(`Entry with follower_id '${id}' and followee_id '${followeeId}' Not Found in ${model.name}`, httpStatus.NOT_FOUND));
                    } else { // should never happen
                    	reject(new APIError('Deleted multiple entries, which should never happen', httpStatus.INTERNAL_SERVER_ERROR));
                    }
                }).catch(err => {
                	cLogger.say(cLogger.GENERAL_TYPE, `ERROR deleting entry : SQL ${err.message} ${JSON.stringify(err.errors)}`);
                    reject(new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR));
                });
            });
	}

}

module.exports = UserRelationshipsHandler;
