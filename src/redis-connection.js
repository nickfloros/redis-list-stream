'use strict';
const redis = require('redis');

module.exports = class RedisConnection {

	/**
	 * simple helper function to create a redis connection
	 * @param  {object} params
	 * @param {object} params.redis contain redis related parameters @see <a href="https://github.com/NodeRedis/node_redis#options-object-properties">redis docs</a> 
	 * {RedsClient} param.client client to use for the connection 
	 * @return {RedisClient}        return instance of a connection to redis
	 */
	static create(params) {

		if (!params) {
			return redis.createClient();
		}

		if (params.client) {
			return params.client;
		}

		if (params.redis) {
			return redis.createClient(params.redis);
		}

		return redis.createClient();

	}

	static get queueName() {
		return 'rfs';
	}
};