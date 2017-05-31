/*
* @Author: KaileDing
* @Date:   2017-05-29 12:15:26
* @Last Modified by:   kaileding
* @Last Modified time: 2017-05-31 02:01:42
*/

'use strict';
import express from 'express';
const router = express.Router();
import httpStatus from 'http-status'
import requestValidator from '../helpers/RequestValidator'
import CLogger from '../helpers/CustomLogger'
import searchHandler from '../handlers/SearchHandler'
let cLogger = new CLogger();

router.get('/', function(req, res, next) {

	requestValidator.validateNearbySearchRequest(req);
	req.getValidationResult().then(result => {
            if (!result.isEmpty()) {
            	cLogger.say(cLogger.TESTING_TYPE, 'At least one error.');
                res.status(httpStatus.BAD_REQUEST).send({
                	message: 'request validation failed.',
                	error: result.array()
                });
            } else {
            	cLogger.say(cLogger.TESTING_TYPE, 'validation passed.');


            	searchHandler({
            		latitude: req.query.lat,
            		longitude: req.query.lon,
            		rankByDistance: true,
            		keyWord: req.query.keyword,
            		typeName: req.query.typename,
            		pageToken: req.query.pagetoken
            	}).then(function(results) {
            		res.status(httpStatus.OK).send(results);
            	}).catch(err => {
            		next(err);
            	})           	
            }
        });

})

module.exports = router;
