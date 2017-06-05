/*
* @Author: KaileDing
* @Date:   2017-06-05 13:11:22
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-05 13:21:47
*/

'use strict';

module.exports = function(sequelize, DataTypes) {
	return sequelize.define("moment", {
		id: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			primaryKey: true
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false
		},
		words: {
			type: DataTypes.TEXT(),
			allowNull: true
		},
		photos: {
			type: DataTypes.JSON,
			allowNull: true
		},
		location_id: {
			type: DataTypes.STRING,
			allowNull: true,
			references: {
                model: 'location',
                key: 'id'
            }
		},
		access_level: {
			type: DataTypes.ENUM('self', 'followers', 'public'),
			allowNull: false,
			defaultValue: 'public'
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
		tableName: 'moment'
	}, {
        indexes: [{unique: true, fields: ['id']}]
    });
}