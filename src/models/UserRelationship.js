/*
* @Author: KaileDing
* @Date:   2017-06-05 21:22:11
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-11 16:25:31
*/

'use strict';
import SequelizeModelHelpers from '../helpers/SequelizeModelHelpers'

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
			unique: 'follower_followee_comb',
			references: {
                model: 'rattit_user',
                key: 'id'
            }
		},
		followee: {
			type: DataTypes.UUID,
			allowNull: false,
			unique: 'follower_followee_comb',
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
		}
	}, {
		tableName: 'user_relation'
	}, {
        indexes: [{unique: true, fields: ['id']}, {unique: true, fields: ['follower', 'followee']}]
    });
}