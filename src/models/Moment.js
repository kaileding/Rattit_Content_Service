/*
* @Author: KaileDing
* @Date:   2017-06-05 13:11:22
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-09 20:48:37
*/

'use strict';

module.exports = function(sequelize, DataTypes) {
	return sequelize.define("moment", {
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
		together_with: {
			type: DataTypes.ARRAY(DataTypes.UUID), // array of user ids
			allowNull: true
		},
		likedBy: {
			type: DataTypes.ARRAY(DataTypes.UUID), // array of user ids
			allowNull: true
		},
		appreciatedBy: {
			type: DataTypes.ARRAY(DataTypes.UUID), // array of user ids
			allowNull: true
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
		tableName: 'moment'
	}, {
        indexes: [{unique: true, fields: ['id']}]
    });
}