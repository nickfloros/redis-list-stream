
'use strict';
const {Writable} = require('stream');
const { v1: uuidv1 } = require('uuid');
const redisClient = require('./redis-connection');

module.exports = class RedisWritableStream extends Writable {
	/**
	 * default constructor for RedisWritableStream
	 * @param  {object} params 
	 * @param {object} params.client instance of redis connection
	 * @param {string} params.queueName name of of queeu (aka list, the nearesest in REDIS constructs) to store message.
	 * @return {RedisWritableStream}        [description]
	 */
	constructor(params) {
		super(params);
		this._client = params.client;
		this._queueName = params.queueName || redisClient.queueName;
	}

	_write(chunk, encoding, callback) {
		const data = JSON.parse(chunk.toString());

		if (!data._id) {
			data._id = uuidv1();
		}

		this._client.rpush(this._queueName,JSON.stringify(data),()=>{
			callback();
		});
	}

	/**
	 * getter
	 * @return {string} name of list message are stored
	 */
	get queueName() {
		return this._queueName;
	}

	/**
	 * getter for client
	 * @return {Redis} client instance
	 */
	get client() {
		return this._client;
	}
	
	/**
	 * support method to create an instance of a RedisWritableStream
	 * @param  {object} params
	 * @param {string} params.queueName name of the queue to create
	 * @params {object} params.redis parameters needed to create a redis connection.
	 * @return {RedisWritableStream}        
	 */
	static createInterface(params) {
		const client = redisClient.create(params);
		return new RedisWritableStream({
			queueName : params.queueName,
			client: client
		});
	}
}
