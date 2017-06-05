/*
* @Author: KaileDing
* @Date:   2017-06-05 10:15:25
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-05 10:57:41
*/

'use strict';

module.exports = function(sequelize, DataTypes) {
	return sequelize.define("location", {
		id: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			primaryKey: true
		},
		loc_point: {
			type: DataTypes.GEOMETRY('POINT', 4326),
			allowNull: false
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'unknown point'
		},
		icon: {
			type: DataTypes.TEXT(), // image URL
			allowNull: true
		},
		types: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			allowNull: true
		},
		google_place_id: {
			type: DataTypes.STRING,
			allowNull: true
		}
		createdBy: {
			type: DataTypes.STRING,
			allowNull: false
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('NOW()')
		},
		modifiedBy: {
			type: DataTypes.STRING,
			allowNull: false
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('NOW()')
		}
	}, {
		tableName: 'location'
	}, {
        indexes: [{unique: true, fields: ['id']}]
    });
}
