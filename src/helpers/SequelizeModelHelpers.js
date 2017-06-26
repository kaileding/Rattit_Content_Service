/*
* @Author: KaileDing
* @Date:   2017-06-11 16:05:34
* @Last Modified by:   kaileding
* @Last Modified time: 2017-06-13 22:36:33
*/

'use strict';

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
	}
}