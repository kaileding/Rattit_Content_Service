/*
* @Author: KaileDing
* @Date:   2017-06-13 22:52:20
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-13 23:11:00
*/

'use strict';
process.env.NODE_ENV = 'test';

let httpStatus = require('http-status');
let chai = require('chai');
let should = chai.should();
let chaiHttp = require('chai-http');
let server = require('../src/app');
chai.use(chaiHttp);


describe('Locations Tests', function() {
	before(function(done) {
		chai.request(server).get('/api/v1/db/init?force=true').end(function(err, res) {
			res.should.have.status(httpStatus.OK);
			done();
		});
	});

	it('[GET] /api/v1/locations - should get all 2 locations', function(done) {
		chai.request(server).get('/api/v1/locations').end(function(err, res) {
			res.should.have.status(httpStatus.OK);
			res.body.count.should.be.eq(2);
			res.body.rows.length.should.be.eq(2);
			done();
		});
	});

	it('[GET] /api/v1/locations?limit=1&offset=1 - should get 1 location', function(done) {
		chai.request(server).get('/api/v1/locations?limit=1&offset=1').end(function(err, res) {
			res.should.have.status(httpStatus.OK);
			res.body.count.should.be.eq(2);
			res.body.rows.length.should.be.eq(1);
			done();
		});
	});

	it('[GET] /api/v1/locations?lat=37.55389&lon=-122.300105&distance=150 - should get 1 location', function(done) {
		chai.request(server).get('/api/v1/locations?lat=37.55389&lon=-122.300105&distance=150').end(function(err, res) {
			res.should.have.status(httpStatus.OK);
			res.body.count.should.be.eq(1);
			res.body.rows.length.should.be.eq(1);
			done();
		})
	})

	it('[GET] /api/v1/locations?text=Mateo - should get 1 location', function(done) {
		chai.request(server).get('/api/v1/locations?text=Mateo').end(function(err, res) {
			res.should.have.status(httpStatus.OK);
			res.body.count.should.be.eq(1);
			res.body.rows.length.should.be.eq(1);
			done();
		});
	});

	it('[GET] /api/v1/locations/191a4da2-4db5-11e7-b114-b2f933d5fe66 - should get that location', function(done) {
		chai.request(server).get('/api/v1/locations/191a4da2-4db5-11e7-b114-b2f933d5fe66').end(function(err, res) {
			res.should.have.status(httpStatus.OK);
			done();
		});
	});

	it('[PATCH] /api/v1/locations/191a4da2-4db5-11e7-b114-b2f933d5fe66 - should success', function(done) {
		chai.request(server).patch('/api/v1/locations/191a4da2-4db5-11e7-b114-b2f933d5fe66').send({
			"coordinates": {
				"longitude": -122.29901,
				"latitude": 37.552553
			},
			"name": "23 awgwr jjjj",
			"icon_url": "https://s3-us-west-1.amazonaws.com/kaile-bucket-1/cross-hammers.png",
			"types": ["food", "niubility"],
			"google_place_id": "23bc8338a0d35ea5e129a01ed998b4ec856607b1"
		}).end(function(err, res) {
			res.should.have.status(httpStatus.OK);
			done();
		});
	});

	it('[DELETE] /api/v1/locations/191a4da2-4db5-11e7-b114-b2f933d5fe66 - should success', function(done) {
		chai.request(server).delete('/api/v1/locations/191a4da2-4db5-11e7-b114-b2f933d5fe66').end(function(err, res) {
			res.should.have.status(httpStatus.OK);
			done();
		});
	});

	it('[POST] /api/v1/locations - should success', function(done) {
		chai.request(server).post('/api/v1/locations').send({
			"coordinates": {
				"longitude": -122.29901,
				"latitude": 37.552553
			},
			"name": "23 awgwr",
			"icon_url": "https://s3-us-west-1.amazonaws.com/kaile-bucket-1/cross-hammers.png",
			"types": ["food", "niubility"],
			"google_place_id": "23bc8338a0d35ea5e129a01ed998b4ec856607b1"
		}).end(function(err, res) {
			res.should.have.status(httpStatus.CREATED);
			done();
		});
	});
	
});
