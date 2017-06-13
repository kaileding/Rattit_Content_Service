/*
* @Author: KaileDing
* @Date:   2017-06-11 14:23:14
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-11 19:13:41
*/

'use strict';
import SequelizeModelHelpers from '../helpers/SequelizeModelHelpers'

module.exports = function(sequelize, DataTypes) {
	return sequelize.define("votes_for_answer", {
		id: {
			type: DataTypes.UUID,
			allowNull: false,
			unique: true,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV1
		},
		vote_type: {
			type: DataTypes.ENUM('agree', 'disagree', 'admire'),
			allowNull: false,
			defaultValue: 'agree',
			unique: 'who_vote_for_which_answer'
		},
		answer_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
                model: 'answer',
                key: 'id'
            },
			unique: 'who_vote_for_which_answer'
		},
		createdBy: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
                model: 'rattit_user',
                key: 'id'
            },
			unique: 'who_vote_for_which_answer'
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
		tableName: 'votes_for_answer'
	}, {
        indexes: [{unique: true, fields: ['id']}, {unique: true, fields: ['vote_type', 'answer_id', 'createdBy']}]
    });
}