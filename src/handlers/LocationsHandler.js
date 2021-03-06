/*
* @Author: KaileDing
* @Date:   2017-06-08 00:37:54
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-21 23:34:37
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

		let includeObj = [{
			model: models.Users
		}];

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
		        			$contains: [queryObj.text.toLowerCase()]
		        		}
		        	}
		        ) : true;

	    let queryDate;
	    if (queryObj.queryDateType === 'nolater_than' && queryObj.dateLine) {
	    	queryDate = {
	    		createdAt: {
	    			$lte: queryObj.dateLine
	    		}
	    	};
    	} else if (queryObj.queryDateType === 'noearlier_than' && queryObj.dateLine) {
    		queryDate = {
    			createdAt: {
    				$gte: queryObj.dateLine
    			}
    		};
    	} else {
    		queryDate = true;
    	}

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
	        	queryText,
	        	queryDate
			);

		let orderObj = [['createdAt', 'DESC']];

		let limit = queryObj.limit;

		let offset = queryObj.offset;


		return this.findEntriesFromModel(selectObj, includeObj, filterObj, orderObj, limit, offset);
	}

}



module.exports = LocationsHandler;
