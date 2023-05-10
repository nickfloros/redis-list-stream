'use strict';
const redis = require('redis');

module.exports = class RedisConnection {

	/**
	 * simple helper function to create a redis connection
	 * @param {object} params create redis client ... 
	 * @param {string} param.host where redis server is deployed
	 * @param {number} param.port redis server is listening
	 * @param {boolean} param.tls set to true for connecting to redis server using ssl
	 * @param {string} param.password to connect to redis
	 * @return {RedisClient}        return instance of a connection to redis
	 */
	static async create(params) {
		const {host, port, password} =params;

		if (!host) {
			throw new Error('can not create redis client - missing host');
		}
		if (!port) {
			throw new Error('can not create redis client - missing port');
		}
		if (!password) {
			throw new Error('can not create redis client - missing password');
		}

		const redisConfig = { // see https://github.com/redis/node-redis/blob/master/docs/client-configuration.md
			socket : {
				host : host,
				port : parseInt(port),
				tls : params.tls || false,
				keepAlive : 5000,
				reconnectStrategy : 100
			},
			password 
		}
		return redis.createClient(redisConfig);
	}

};