/*
* @Author: KaileDing
* @Date:   2017-06-05 21:34:00
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-05 22:26:29
*/

'use strict';

module.exports = function(sequelize, DataTypes) {
	return sequelize.define("comment_for_moment", {
		id: {
			type: DataTypes.UUID,
			allowNull: false,
			unique: true,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV1
		},
		for_moment: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'moment',
				key: 'id'
			}
		},
		for_comment: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'comment_for_moment',
				key: 'id'
			}
		},
		words: {
			type: DataTypes.TEXT(),
			allowNull: true
		},
		photos: {
			type: DataTypes.JSON,
			allowNull: true
		},
		hash_tags: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			allowNull: true
		},
		likedBy: {
			type: DataTypes.ARRAY(DataTypes.UUID), // array of user ids
			allowNull: true
		},
		dislikedBy: {
			type: DataTypes.ARRAY(DataTypes.UUID), // array of user ids
			allowNull: true
		},
		createdBy: {
			type: DataTypes.STRING,
			allowNull: false
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
		tableName: 'comment_for_moment'
	}, {
        indexes: [{unique: true, fields: ['id']}]
    });
}