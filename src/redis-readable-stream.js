'use strict';
const {
	Readable
} = require('stream');
const { v1: uuidv1 } = require('uuid');

const redisClient = require('./redis-connection');

module.exports = class RedisReadableStream extends Readable {
	/**
	 * default constructor of RedisReadbleStream
	 * @param  {object} params 
	 * @oaram {string} params.queueName name of the queue where the message will be read.
	 * @params {object} params.client instance of redis client. this connction can't be shared with other transactions as we are ising block reads
	 * @return {[type]}        [description]
	 */
	constructor(params) {
		super(params);
		this._queueName = params.queueName || redisClient.queueName;
		this._client = params.client;
	}

	_read(size) {
		this._client.brpop(this._queueName, 0, (err, entry) => {
			const data = JSON.parse(entry[1]);
			if (!data._id) {
				data._id = uuidv1();
			}
			this.push(JSON.stringify(data));
		});
	}

	get queueName() {
		return this._queueName;
	}

	get client() {
		return this._client;
	}
	
	/**
	 * helper function to create a RedisReadableStream
	 * @param  {object} params
	 * @param {string} params.queueName redis queue (list) to read messages from
	 * @param {object} params.redis set of standard redis parameters to create a client connection.
	 * @return {RedisReadbaleStream}        
	 */
	static createInterface(params) {
		const client = redisClient.create(params);
		return new RedisReadableStream({
			queueName: params.queueName,
			client: client
		});
	}
}