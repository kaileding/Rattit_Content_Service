/*
* @Author: KaileDing
* @Date:   2017-06-12 23:45:59
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-13 00:31:47
*/

'use strict';
import SequelizeModelHelpers from '../helpers/SequelizeModelHelpers'

module.exports = function(sequelize, DataTypes) {
	return sequelize.define("collect_answer", {
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
			unique: 'which_contains_which_answer'
		},
		answer_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
                model: 'answer',
                key: 'id'
            },
			unique: 'which_contains_which_answer'
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
		tableName: 'collect_answer'
	}, {
        indexes: [{unique: true, fields: ['id']}, {unique: true, fields: ['collection_id', 'answer_id']}]
    });
}