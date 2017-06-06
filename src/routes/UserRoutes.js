/*
* @Author: KaileDing
* @Date:   2017-06-05 23:00:55
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-05 23:28:20
*/

'use strict';
import express from 'express';
const router = express.Router();
import usersController from '../controllers/UsersController'

router.post('/', usersController.createUser);

router.get('/:id', usersController.getUserById);

router.get('/', usersController.getUserByQuery);

router.patch('/:id', usersController.updateUser);

router.delete('/:id', usersController.deleteUser);

module.exports = router;