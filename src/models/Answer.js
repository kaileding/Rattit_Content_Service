/*
* @Author: KaileDing
* @Date:   2017-06-05 22:03:25
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-09 20:50:37
*/

'use strict';

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
			allowNull: true
		},
		agreedBy: {
			type: DataTypes.ARRAY(DataTypes.UUID), // array of user ids
			allowNull: true
		},
		disagreedBy: {
			type: DataTypes.ARRAY(DataTypes.UUID), // array of user ids
			allowNull: true
		},
		agree_minus_disagree: {
			type: new DataTypes.VIRTUAL(DataTypes.INTEGER, ['agreedBy', 'disagreedBy']),
		    get: function() {
		    	return this.get('agreedBy') - this.get('disagreedBy');
		    }
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
		tableName: 'answer'
	}, {
        indexes: [{unique: true, fields: ['id']}]
    });
}