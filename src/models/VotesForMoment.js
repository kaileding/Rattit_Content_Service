/*
* @Author: KaileDing
* @Date:   2017-06-11 12:08:42
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-11 19:12:51
*/

'use strict';
import SequelizeModelHelpers from '../helpers/SequelizeModelHelpers'

module.exports = function(sequelize, DataTypes) {
	return sequelize.define("votes_for_moment", {
		id: {
			type: DataTypes.UUID,
			allowNull: false,
			unique: true,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV1
		},
		vote_type: {
			type: DataTypes.ENUM('like', 'admire', 'pity'),
			allowNull: false,
			defaultValue: 'like',
			unique: 'who_vote_for_which_moment'
		},
		moment_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
                model: 'moment',
                key: 'id'
            },
			unique: 'who_vote_for_which_moment'
		},
		createdBy: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
                model: 'rattit_user',
                key: 'id'
            },
			unique: 'who_vote_for_which_moment'
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('NOW()')
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('NOW()')
		}
	}, {
		tableName: 'votes_for_moment'
	}, {
        indexes: [{unique: true, fields: ['id']}, {unique: true, fields: ['vote_type', 'moment_id', 'createdBy']}]
    });
}