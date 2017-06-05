/*
* @Author: KaileDing
* @Date:   2017-06-05 14:02:16
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-05 15:29:53
*/

'use strict';
import express from 'express';
const router = express.Router();
import httpStatus from 'http-status'
import dbConnectionPool from '../data/DBConnection'
import models from '../models/Model_Index'
import CLogger from '../helpers/CustomLogger'
let cLogger = new CLogger();

router.get('/init', (req, res, next) => {
	let forceFlag = (req.query.force && 
		(req.query.force===1 || req.query.force===true || req.query.force==='true'));
	let dbInitMsg = forceFlag ? 'Database forcely synchronized successfully' : 'Database seeded successfully';

	dbConnectionPool.sync({
		force: forceFlag
	}).then(function (r) {
        res.status(httpStatus.OK).send({
            status: "success",
            message: dbInitMsg
        });
    }, function (err) {
    	cLogger.say(cLogger.ESSENTIAL_TYPE, err);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            status: "failure",
            message: "Database failed to be seeded"
        });
    });
});

router.post('/locations', (req, res, next) => {

	models.Locations.create({
					loc_point: {
						type: 'Point',
						coordinates: [39.807222,-76.984722],
						crs: { type: 'name', properties: { name: 'EPSG:4326'} }
					},
					name: 'point 1',
					icon: null,
					types: null,
					google_place_id: null,
					createdBy: 'user 1',
					updatedBy: 'user 1'
				}).then(function(result) {
					cLogger.say(cLogger.TESTING_TYPE, 'save one location successfully.', result);
					res.status(httpStatus.OK).send(result.toJSON());
				}).catch(function(error) {
			    	throw error;
			    });

})

module.exports = router;