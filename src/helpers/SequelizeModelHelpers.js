/*
* @Author: KaileDing
* @Date:   2017-06-11 16:05:34
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-11 19:59:08
*/

'use strict';
import _ from 'lodash'

module.exports = {
	makeStringsInArrayToLowerCase: function(fieldName) {
		var setterFunc = function(val) {};
		if (typeof fieldName === 'string') {
			setterFunc = function(vals) {
	            var newVals = [];
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
	            var newVal = _.trim(val, ' \n');
                this.setDataValue(fieldName, newVal);
			};
		}
		return setterFunc;
	}
}