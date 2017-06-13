/*
* @Author: KaileDing
* @Date:   2017-06-05 23:00:55
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-10 23:37:02
*/

'use strict';
import express from 'express';
const router = express.Router();
import requestInterceptor from '../interceptors/RequestInterceptor'
import usersController from '../controllers/UsersController'

router.use('/', requestInterceptor);

router.post('/', usersController.createUser);

router.get('/', usersController.getUsersByQuery);

router.get('/:id', usersController.getUserById);

router.patch('/:id', usersController.updateUser);

router.delete('/:id', usersController.deleteUser);

router.get('/:id/followers', usersController.getFollowersOfAUser);

router.get('/:id/followees', usersController.getFolloweesOfAUser);

router.post('/:id/followees', usersController.followUsers);

router.delete('/:id/followees/:followee_id', usersController.unfollowAUser);

module.exports = router;