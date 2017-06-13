/*
* @Author: KaileDing
* @Date:   2017-06-05 22:27:23
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-12 18:14:55
*/

'use strict';
import SequelizeModelHelpers from '../helpers/SequelizeModelHelpers'

module.exports = function(sequelize, DataTypes) {
	return sequelize.define("comment_for_answer", {
		id: {
			type: DataTypes.UUID,
			allowNull: false,
			unique: true,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV1
		},
		for_answer: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'answer',
				key: 'id'
			}
		},
		for_comment: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'comment_for_answer',
				key: 'id'
			}
		},
		words: {
			type: DataTypes.TEXT(),
			allowNull: true
		},
		likedBy: {
			type: DataTypes.ARRAY(DataTypes.UUID), // array of rattit_user ids
			allowNull: false,
			defaultValue: []
		},
		createdBy: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
                model: 'rattit_user',
                key: 'id'
            }
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
		},
		deletedAt: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: null
		}
	}, {
		tableName: 'comment_for_answer'
	}, {
        indexes: [{unique: true, fields: ['id']}]
    });
}