/*
* @Author: KaileDing
* @Date:   2017-06-05 21:03:26
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-11 00:47:24
*/

'use strict';

module.exports = function(sequelize, DataTypes) {
	return sequelize.define("rattit_user", {
		id: {
			type: DataTypes.UUID,
			allowNull: false,
			unique: true,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV1
		},
		username: {
			type: DataTypes.STRING(32),
			allowNull: false
		},
		email: {
			type: DataTypes.STRING(64),
			allowNull: false
		},
		first_name: {
			type: DataTypes.STRING(32),
			allowNull: false
		},
		last_name: {
			type: DataTypes.STRING(32),
			allowNull: false
		},
		gender: {
			type: DataTypes.ENUM('male', 'female', 'untold'),
			allowNull: false
		},
		manifesto: {
			type: DataTypes.TEXT(),
			allowNull: true
		},
		organization: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			allowNull: true
		},
		avatar: {
			type: DataTypes.TEXT(), // image URL
			allowNull: true
		},
		follower_number: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		followee_number: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
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
		tableName: 'rattit_user'
	}, {
        indexes: [{unique: true, fields: ['id']}]
    });
}