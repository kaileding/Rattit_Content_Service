/*
* @Author: KaileDing
* @Date:   2017-05-31 00:59:12
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-09 23:03:01
*/

'use strict';
class CustomLogger {
	constructor() {
		this.generalPrintingAllowed = true;
		this.testingPrintingAllowed = true;
		this.essentialPrintingAllowed = true;
		this.newlinePrintingAllowed = true;
		this.GENERAL_TYPE = '0';
		this.TESTING_TYPE = '1';
		this.ESSENTIAL_TYPE = '2';
		this.NEWLINE_TYPE = '3';
	}

	say(logType, ...logData) {
		if ((logType === this.GENERAL_TYPE) && this.generalPrintingAllowed) {
			logData.forEach(data => {
				console.log(data);
			});
		} else if ((logType === this.TESTING_TYPE) && this.testingPrintingAllowed) {
			console.log('[TESTING]:');
			logData.forEach(data => {
				console.log(data);
			});
			console.log('[END-OF-TESTING]');
		} else if ((logType === this.ESSENTIAL_TYPE) && this.essentialPrintingAllowed) {
			console.log('----ESSENTIAL----:');
			logData.forEach(data => {
				console.log(data);
			});
		} else if ((logType === this.NEWLINE_TYPE) && this.newlinePrintingAllowed) {
			console.log('\n');
			logData.forEach(data => {
				console.log(data);
			});
		}
	}

	logSQL(...logData) {
		let SQLPrintingAllowed = true;
		if (SQLPrintingAllowed) {
			logData.forEach(data => {
				console.log(data);
			});
		}
	}
}

module.exports = CustomLogger;
