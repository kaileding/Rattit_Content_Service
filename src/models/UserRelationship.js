/*
* @Author: KaileDing
* @Date:   2017-06-05 21:22:11
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-05 21:32:38
*/

'use strict';

module.exports = function(sequelize, DataTypes) {
	return sequelize.define("user_relation", {
		id: {
			type: DataTypes.UUID,
			allowNull: false,
			unique: true,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV1
		},
		follower: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
                model: 'user',
                key: 'id'
            }
		},
		followee: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'user',
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
		}
	}, {
		tableName: 'user_relation'
	}, {
        indexes: [{unique: true, fields: ['id']}, {unique: true, fields: ['follower', 'followee']}]
    });
}