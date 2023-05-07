'use strict';
const redis = require('redis');

module.exports = class RedisConnection {

	/**
	 * simple helper function to create a redis connection
	 * @param  {object} params create redis client ... 
	 * @return {RedisClient}        return instance of a connection to redis
	 */
	static create(params) {
		return redis.createClient(params);
	}

};