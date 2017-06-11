/*
* @Author: KaileDing
* @Date:   2017-06-06 02:42:04
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-10 16:27:35
*/

'use strict';
import Promise from 'bluebird'
import Sequelize from 'sequelize'
import models from '../models/Model_Index'
import DataModelHandler from './DataModelHandler'
import rp from 'request-promise'
import httpStatus from 'http-status'
import APIError from '../helpers/APIError'
import CLogger from '../helpers/CustomLogger'
import consts from '../config/Constants'
let cLogger = new CLogger();

class UsersHandler extends DataModelHandler {
	constructor() {
		super(models.Users);
	}

	findUserByText(text) {
		let filterObj = text ? Sequelize.or(
	        	{
	        		username: {
	        			ilike: '%'+text+'%'
	        		}
	        	}, 
	        	{
	        		manifesto: {
		                ilike: '%'+text+'%'
		            }
	        	}
	        ) : null;

		let orderObj = [['follower_number', 'DESC']];

		return this.findEntriesFromModel(null, filterObj, orderObj);
	}

}

module.exports = UsersHandler;
