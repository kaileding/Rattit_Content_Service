/*
* @Author: KaileDing
* @Date:   2017-06-05 13:22:43
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-09 20:50:00
*/

'use strict';

module.exports = function(sequelize, DataTypes) {
	return sequelize.define("collection", {
		id: {
			type: DataTypes.UUID,
			allowNull: false,
			unique: true,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV1
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false
		},
		description: {
			type: DataTypes.TEXT(),
			allowNull: true
		},
		cover_image: {
			type: DataTypes.TEXT(), // image URL
			allowNull: true
		},
		tags: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			allowNull: true
		},
		access_level: {
			type: DataTypes.ENUM('self', 'followers', 'public'),
			allowNull: false,
			defaultValue: 'public'
		},
		createdBy: {
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
		tableName: 'collection'
	}, {
        indexes: [{unique: true, fields: ['id']}]
    });
}