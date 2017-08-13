/*
* @Author: KaileDing
* @Date:   2017-05-30 09:16:16
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-10 21:20:54
*/

'use strict';

module.exports = {
	NEARBY_SEARCH_TYPE: 'nearby-search',
	NEARBY_SEARCH_BASE_URL: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
	TEXT_SEARCH_TYPE: 'text-search',
	TEXT_SEARCH_BASE_URL: 'https://maps.googleapis.com/maps/api/place/textsearch/json',
	PLACE_DETAILS_TYPE: 'detail-search',
	PLACE_DETAILS_URL: 'https://maps.googleapis.com/maps/api/place/details/json',

	DB_QUERY_DEFAULT_LIMIT: 120,
	DYNAMO_THRESHOLD_OF_FOLLOWERNUM: 2
}