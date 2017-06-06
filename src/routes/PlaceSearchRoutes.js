/*
* @Author: KaileDing
* @Date:   2017-05-29 12:15:26
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-05 23:02:30
*/

'use strict';
import express from 'express';
const router = express.Router();
import placeSearchController from '../controllers/PlaceSearchController'

router.get('/nearby', placeSearchController.nearbySearch);

router.get('/text', placeSearchController.textSearch);

router.get('/place/:id', placeSearchController.getPlaceDetails);

module.exports = router;
