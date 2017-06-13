/*
* @Author: KaileDing
* @Date:   2017-05-29 12:15:26
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-10 00:45:29
*/

'use strict';
import express from 'express';
const router = express.Router();
import requestInterceptor from '../interceptors/RequestInterceptor'
import placeSearchController from '../controllers/PlaceSearchController'
import locationController from '../controllers/LocationController'

router.use('/', requestInterceptor);

router.get('/nearby', placeSearchController.nearbySearch);

router.get('/text', placeSearchController.textSearch);

router.get('/place/:id', placeSearchController.getPlaceDetails);

router.post('/', locationController.createLocation);

router.get('/', locationController.getLocationsByQuery);

router.get('/:id', locationController.getLocationById);

router.patch('/:id', locationController.updateLocation);

router.delete('/:id', locationController.deleteLocation);

module.exports = router;
