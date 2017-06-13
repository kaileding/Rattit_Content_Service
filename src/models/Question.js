/*
* @Author: KaileDing
* @Date:   2017-06-05 21:56:05
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-12 18:16:20
*/

'use strict';
import SequelizeModelHelpers from '../helpers/SequelizeModelHelpers'

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
			allowNull: true,
			set: SequelizeModelHelpers.makeStringsInArrayToLowerCase('hash_tags')
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
		interests_number: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		invites_number: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		pitys_number: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		createdBy: {
			type: DataTypes.UUID,
			allowNull: false,
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
		},
		deletedAt: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: null
		}
	}, {
		tableName: 'question'
	}, {
        indexes: [{unique: true, fields: ['id']}]
    });
}