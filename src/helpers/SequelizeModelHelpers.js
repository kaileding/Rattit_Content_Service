/*
* @Author: KaileDing
* @Date:   2017-06-11 16:05:34
* @Last Modified by:   kaileding
* @Last Modified time: 2017-07-03 23:43:14
*/

'use strict';
import _ from 'lodash'

module.exports = {
	makeStringsInArrayToLowerCase: function(fieldName) {
		var setterFunc = function(val) {};
		if (typeof fieldName === 'string') {
			setterFunc = function(vals) {
	            var newVals = [];
	            // console.log('in makeStringsInArrayToLowerCase(), vals is ', vals);
                vals.forEach(val => {
                    newVals.push(val.toLowerCase());
                });
                this.setDataValue(fieldName, newVals);
			};
		}
		return setterFunc;
	},

	trimTextToAvoidEndingSpaceAndLineBreak: function(fieldName) {
		var setterFunc = function(val) {};
		if (typeof fieldName === 'string') {
			setterFunc = function(val) {
	            // console.log('in trimTextToAvoidEndingSpaceAndLineBreak(), val is ', val);
	            var newVal = _.trim(val, ' \n');
                this.setDataValue(fieldName, newVal);
			};
		}
		return setterFunc;
	}
}