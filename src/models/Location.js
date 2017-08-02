/*
* @Author: KaileDing
* @Date:   2017-06-05 10:15:25
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-11 16:21:51
*/

'use strict';
import SequelizeModelHelpers from '../helpers/SequelizeModelHelpers'

module.exports = function(sequelize, DataTypes) {
	return sequelize.define("location", {
		id: {
			type: DataTypes.UUID,
			allowNull: false,
			unique: true,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV1
		},
		loc_point: {
			type: DataTypes.GEOMETRY('POINT', 4326),
			allowNull: false
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'unknown point',
			set: SequelizeModelHelpers.trimTextToAvoidEndingSpaceAndLineBreak('name')
		},
		icon: {
			type: DataTypes.TEXT(), // image URL
			allowNull: true
		},
		types: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			allowNull: true,
			set: SequelizeModelHelpers.makeStringsInArrayToLowerCase('types')
		},
		google_place_id: {
			type: DataTypes.STRING,
			allowNull: true
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
		updatedBy: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
                model: 'rattit_user',
                key: 'id'
            }
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
