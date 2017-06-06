/*
* @Author: KaileDing
* @Date:   2017-06-05 21:56:05
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-05 22:02:47
*/

'use strict';

module.exports = function(sequelize, DataTypes) {
	return sequelize.define("question", {
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
		attachment: {
			type: DataTypes.TEXT(), // web link
			allowNull: true
		},
		location_id: {
			type: DataTypes.UUID,
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
		invited_users: {
			type: DataTypes.ARRAY(DataTypes.UUID), // array of user ids
			allowNull: true
		},
		interests: {
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
		tableName: 'question'
	}, {
        indexes: [{unique: true, fields: ['id']}]
    });
}