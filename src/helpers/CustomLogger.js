/*
* @Author: KaileDing
* @Date:   2017-05-31 00:59:12
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-11 19:55:54
*/

'use strict';
class CustomLogger {
	constructor() {
		this.sayTypeAllowed = false;
		this.debugTypeAllowed = true;
		this.printlnTypeAllowed = true;
	}

	println(...logData) {
		if (process.env.NODE_ENV != 'test') {
			if (this.printlnTypeAllowed) {
				console.log('\n----[PRINTLN]----:');
				logData.forEach(data => {
					console.log(data);
				});
				console.log('----------------');
			}
		}
	}

	say(...logData) {
		if (process.env.NODE_ENV != 'test') {
			if (this.sayTypeAllowed) {
				console.log('----[SAY]----:')
				logData.forEach(data => {
					console.log(data);
				});
				console.log('----------------');
			}
		}
	}

	debug(...logData) {
		if (process.env.NODE_ENV != 'test') {
			if (this.debugTypeAllowed) {
				console.log('----[DEBUG]----:');
				logData.forEach(data => {
					console.log(data);
				});
				console.log('----------------');
			}
		}
	}

	logSQL(...logData) {
		if (process.env.NODE_ENV != 'test') {
			let SQLPrintingAllowed = true;
			if (SQLPrintingAllowed) {
				logData.forEach(data => {
					console.log(data);
				});
			}
		}
	}
}

module.exports = CustomLogger;
