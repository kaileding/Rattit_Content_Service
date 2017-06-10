/*
* @Author: KaileDing
* @Date:   2017-06-05 23:00:55
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-10 00:45:46
*/

'use strict';
import express from 'express';
const router = express.Router();
import usersController from '../controllers/UsersController'

router.post('/', usersController.createUser);

router.get('/', usersController.getUsersByQuery);

router.get('/:id', usersController.getUserById);

router.patch('/:id', usersController.updateUser);

router.delete('/:id', usersController.deleteUser);

module.exports = router;