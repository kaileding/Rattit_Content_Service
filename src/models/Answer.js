/*
* @Author: KaileDing
* @Date:   2017-06-05 22:03:25
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-12 18:15:49
*/

'use strict';
import SequelizeModelHelpers from '../helpers/SequelizeModelHelpers'

module.exports = function(sequelize, DataTypes) {
	return sequelize.define("answer", {
		id: {
			type: DataTypes.UUID,
			allowNull: false,
			unique: true,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV1
		},
		for_question: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'question',
				key: 'id'
			}
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
		agree_number: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		disagree_number: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		admirer_number: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		rank_score: {
			type: new DataTypes.VIRTUAL(DataTypes.INTEGER, ['agree_number', 'disagree_number', 'admirer_number']),
		    get: function() {
		    	return this.get('agree_number') + this.get('admirer_number') - this.get('disagree_number');
		    }
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
		},
		deletedAt: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: null
		}
	}, {
		tableName: 'answer'
	}, {
        indexes: [{unique: true, fields: ['id']}]
    });
}