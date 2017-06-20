/*
* @Author: KaileDing
* @Date:   2017-06-19 20:39:07
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-19 22:15:30
*/

'use strict';
import Promise from 'bluebird'
import Sequelize from 'sequelize'
import models from '../models/Model_Index'
import rp from 'request-promise'
import httpStatus from 'http-status'
import APIError from '../helpers/APIError'
import CLogger from '../helpers/CustomLogger'
import consts from '../config/Constants'
import aws from 'aws-sdk'
let cLogger = new CLogger();

let AWSHandler = {

	getS3SignedUploadURL: function(filename, filetype) {
		const s3 = new aws.S3();
		const S3_REGION = process.env.S3_REGION;
		const S3_BUCKET = process.env.S3_BUCKET;
		const s3Params = {
			Bucket: S3_BUCKET,
			Key: filename,
			Expires: 20,
			ContentType: filetype,
			ACL: 'public-read'
		};

		return new Promise((resolve, reject) => {
			s3.getSignedUrl('putObject', s3Params, (err, signedUrl) => {
				if (err) {
					reject(new APIError('Error in getting S3-signed-URL: '+err.message));
				} else {
					resolve({
						signedRequestUrl: signedUrl,
						publicUrl: `https://${S3_REGION}.amazonaws.com/${S3_BUCKET}/${filename}`
					});
				}
			})
		})

	}

}

module.exports = AWSHandler;
