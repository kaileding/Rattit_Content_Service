/*
 * @Author: Kaile Ding 
 * @Date: 2017-08-09 01:04:09 
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-09 01:06:07
 */

'use strict';

module.exports = {
    options: {
        region: 'us-west-2',
        apiVersion: '2012-08-10',
        maxRetries: 5,
        retryDelayOptions: {
            base: 50,
            customBackoff: function(retryCount) {
                return 50*Math.pow(2, retryCount-1);
            }
        }
    }
};