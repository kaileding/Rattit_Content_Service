/*
 * @Author: Kaile Ding 
 * @Date: 2017-08-06 18:51:52 
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-07 08:53:28
 */

'use strict';
import SequelizeModelHelpers from '../helpers/SequelizeModelHelpers'

module.exports = function(sequelize, DataTypes) {
	return sequelize.define("activity", {
		id: {
			type: DataTypes.UUID,
			allowNull: false,
			unique: true,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV1
        },
        actor: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
                model: 'rattit_user',
                key: 'id'
            }
        },
        action: {
			type: DataTypes.ENUM('post', 'vote', 'comment', 'none'),
			allowNull: false,
			defaultValue: 'none'
        },
        target: {
            type: DataTypes.TEXT(), // tableName:rowKey
            allowNull: false
        },
        recipients: {
            type: DataTypes.ARRAY(DataTypes.UUID), // array of rattit_user ids
			allowNull: false,
			defaultValue: []
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
		tableName: 'activity'
	}, {
        indexes: [{unique: true, fields: ['id']}]
    });
}