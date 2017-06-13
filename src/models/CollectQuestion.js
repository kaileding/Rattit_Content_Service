/*
* @Author: KaileDing
* @Date:   2017-06-12 23:35:37
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-13 00:30:58
*/

'use strict';
import SequelizeModelHelpers from '../helpers/SequelizeModelHelpers'

module.exports = function(sequelize, DataTypes) {
	return sequelize.define("collect_question", {
		id: {
			type: DataTypes.UUID,
			allowNull: false,
			unique: true,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV1
		},
		collection_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
                model: 'collection',
                key: 'id'
            },
			unique: 'which_contains_which_question'
		},
		question_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
                model: 'question',
                key: 'id'
            },
			unique: 'which_contains_which_question'
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
		tableName: 'collect_question'
	}, {
        indexes: [{unique: true, fields: ['id']}, {unique: true, fields: ['collection_id', 'question_id']}]
    });
}