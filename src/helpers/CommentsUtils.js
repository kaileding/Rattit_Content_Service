/*
* @Author: KaileDing
* @Date:   2017-08-04 01:05:34
* @Last Modified by:   kaileding
* @Last Modified time: 2017-08-04 01:06:51
*/

'use strict';
import _ from 'lodash'

module.exports = {
	groupCommentsIntoTwoLevelDialogs: function(commentsArray, referenceFieldName) {
        var commentDic = {};
        commentsArray.forEach(oneCm => {
            commentDic[oneCm.id] = oneCm;
        });
        var visited = [];
        var dialog_format_res = {};
        commentsArray.forEach(oneCm => {
            var group = [];
            if (visited.indexOf(oneCm.id) == -1) {
                var cmPointer = oneCm;
                while (cmPointer[referenceFieldName]) {
                    if (visited.indexOf(cmPointer.id) ==  -1) {
                        group.unshift(cmPointer.id);
                        visited.push(cmPointer.id);
                    }
                    cmPointer = commentDic[cmPointer[referenceFieldName]];
                };
                if (dialog_format_res[cmPointer.id]) {
                    dialog_format_res[cmPointer.id] = group.concat(dialog_format_res[cmPointer.id]);
                } else {
                    dialog_format_res[cmPointer.id] = group;
                }
            }
        });

        return dialog_format_res;
	}
}