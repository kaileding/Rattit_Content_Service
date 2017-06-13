/*
* @Author: KaileDing
* @Date:   2017-06-11 12:15:19
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-11 19:14:43
*/

'use strict';
import SequelizeModelHelpers from '../helpers/SequelizeModelHelpers'

module.exports = function(sequelize, DataTypes) {
	return sequelize.define("votes_for_question", {
		id: {
			type: DataTypes.UUID,
			allowNull: false,
			unique: true,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV1
		},
		vote_type: {
			type: DataTypes.ENUM('interest', 'invite', 'pity'),
			allowNull: false,
			defaultValue: 'interest',
			unique: 'who_vote_for_which_question'
		},
		question_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
                model: 'question',
                key: 'id'
            },
			unique: 'who_vote_for_which_question'
		},
		subject_id: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
                model: 'rattit_user',
                key: 'id'
            },
			unique: 'who_vote_for_which_question'
		},
		createdBy: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
                model: 'rattit_user',
                key: 'id'
            },
			unique: 'who_vote_for_which_question'
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
		tableName: 'votes_for_question'
	}, {
        indexes: [{unique: true, fields: ['id']}, {unique: true, fields: ['vote_type', 'question_id', 'subject_id', 'createdBy']}]
    });
}