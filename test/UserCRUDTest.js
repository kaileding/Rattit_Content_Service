/*
* @Author: KaileDing
* @Date:   2017-06-13 15:56:46
* @Last Modified by:   kaileding
* @Last Modified time: 2017-07-04 01:03:00
*/

'use strict';
process.env.NODE_ENV = 'test';

let httpStatus = require('http-status');
let chai = require('chai');
let should = chai.should();
let chaiHttp = require('chai-http');
let server = require('../src/app');
chai.use(chaiHttp);


describe('Users Tests', function() {
	before(function(done) {
		chai.request(server).get('/api/v1/db/init?force=true').end(function(err, res) {
			res.should.have.status(httpStatus.OK);
			done();
		});
	});

	it('[GET] /api/v1/users - should get all 8 users', function(done) {
		chai.request(server).get('/api/v1/users').end(function(err, res) {
			res.should.have.status(httpStatus.OK);
			res.body.count.should.be.eq(8);
			res.body.rows.length.should.be.eq(8);
			done();
		});
	});

	it('[GET] /api/v1/users?limit=1&offset=1 - should get 1 user', function(done) {
		chai.request(server).get('/api/v1/users?limit=1&offset=1').end(function(err, res) {
			res.should.have.status(httpStatus.OK);
			res.body.count.should.be.eq(8);
			res.body.rows.length.should.be.eq(1);
			done();
		});
	});

	it('[GET] /api/v1/users?text=happy - should get 1 user', function(done) {
		chai.request(server).get('/api/v1/users?text=happy').end(function(err, res) {
			res.should.have.status(httpStatus.OK);
			res.body.count.should.be.eq(1);
			res.body.rows.length.should.be.eq(1);
			done();
		});
	});

	it('[GET] /api/v1/users/04a9e6b6-4db5-11e7-b114-b2f933d5fe66 - should that user', function(done) {
		chai.request(server).get('/api/v1/users/04a9e6b6-4db5-11e7-b114-b2f933d5fe66').end(function(err, res) {
			res.should.have.status(httpStatus.OK);
			done();
		});
	});

	it('[PATCH] /api/v1/users/04a9e6b6-4db5-11e7-b114-b2f933d5fe66 - should success', function(done) {
		chai.request(server).patch('/api/v1/users/04a9e6b6-4db5-11e7-b114-b2f933d5fe66').send({
			"username": "username 2",
		    "manifesto": "Be happy! Don't worry!",
		    "organization": ["Umich", "California"],
		    "avatar": "https://s3-us-west-1.amazonaws.com/kaile-bucket-1/cross-hammers.png"
		}).end(function(err, res) {
			res.should.have.status(httpStatus.OK);
			done();
		});
	});

	it('[DELETE] /api/v1/users/04a9e6b6-4db5-11e7-b114-b2f933d5fe66 - should success', function(done) {
		chai.request(server).delete('/api/v1/users/04a9e6b6-4db5-11e7-b114-b2f933d5fe66').end(function(err, res) {
			res.should.have.status(httpStatus.OK);
			done();
		});
	});

	it('[POST] /api/v1/users - should success', function(done) {
		chai.request(server).post('/api/v1/users').send({
			"username": "username 1",
		    "email": "user1@sample.com",
		    "first_name": "kaile",
		    "last_name": "ding",
		    "gender": "male",
		    "manifesto": "Be happy!",
		    "organization": ["Umich"],
		    "avatar": "https://s3-us-west-1.amazonaws.com/kaile-bucket-1/cross-hammers.png"
		}).end(function(err, res) {
			res.should.have.status(httpStatus.CREATED);
			done();
		});
	});

	it('[POST] /api/v1/users/e5b89946-4db4-11e7-b114-b2f933d5fe66/followees - should success', function(done) {
		chai.request(server).post('/api/v1/users/e5b89946-4db4-11e7-b114-b2f933d5fe66/followees').send({
			"followees": [
				"04a9e6b6-4db5-11e7-b114-b2f933d5fe66",
				"baddc2ca-4e6b-11e7-b114-b2f933d5fe66",
				"d839cf08-4e6b-11e7-b114-b2f933d5fe66"
			]
		}).end(function(err, res) {
			res.should.have.status(httpStatus.CREATED);
			res.body.length.should.be.eq(3);
			done();
		});
	});
	
});

