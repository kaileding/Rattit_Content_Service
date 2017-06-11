/*
* @Author: KaileDing
* @Date:   2017-06-08 00:37:54
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-10 21:39:13
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
// let locationDataHandler = new DataModelHandler(models.Locations);
let cLogger = new CLogger();

class LocationsHandler extends DataModelHandler {
	constructor() {
		super(models.Locations);
	}

	findLocationsByQuery(queryObj) {

   		let okToQueryDistance = (queryObj.coordinates.longitude 
   								&& queryObj.coordinates.latitude 
   								&& queryObj.distance);
   		let queryDistance = okToQueryDistance ?  Sequelize.where(
	   			Sequelize.fn('ST_Distance_Sphere', 
	        							Sequelize.fn('ST_SetSRID', 
													Sequelize.fn('ST_MakePoint',  
														queryObj.coordinates.latitude, 
														queryObj.coordinates.longitude), 
													4326), 
	        							Sequelize.col('loc_point')),
	   			{$lte: queryObj.distance}
	   			) : true;

        let queryText = queryObj.text ? Sequelize.or(
		        	{
		        		name: {
		        			ilike: '%'+queryObj.text+'%'
		        		}
		        	}, 
		        	{
		        		types: {
		        			$contains: [queryObj.text]
		        		}
		        	}
		        ) : true;

        let selectObj = okToQueryDistance ? {
        			include: [[Sequelize.fn('ST_Distance_Sphere', 
        							Sequelize.fn('ST_SetSRID', 
												Sequelize.fn('ST_MakePoint',  
													queryObj.coordinates.latitude, 
													queryObj.coordinates.longitude), 
												4326), 
        							Sequelize.col('loc_point')), 'distance']]
        		} : null;

		let filterObj = Sequelize.and(
	        	queryDistance,
	        	queryText
			);

		let orderObj = [['createdAt', 'DESC']];

		let limit = queryObj.limit;

		let offset = queryObj.offset;


		return this.findEntriesFromModel(selectObj, filterObj, orderObj, limit, offset);
	}

}



module.exports = LocationsHandler;
