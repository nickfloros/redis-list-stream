
'use strict';
const {Writable} = require('stream');
const { v4: uuidv4 } = require('uuid');

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

		this._validate(params);
		this._client = params.client;
		this._queueName = params.queueName;

		this._client.on('ready',()=>{
			this.uncork();
		});

		// block until redis client is ready ...
		this.cork();
	}

	_validate(params) {

		if (!params.queueName) {
			throw new Error('RedisWritableStream : queue name is undefined');
		}
		if (!params.client) {
			throw new Error('RedisWritableStream : redis client is undefined')
		}
	}

	_write(chunk, encoding, callback) {
		const data = JSON.parse(chunk.toString());

		// add _id if it does not exist ... 
		if (!data._id) {
			data._id = uuidv4();
		}

		this._client.rPush(this._queueName,JSON.stringify(data))
			.then(()=>{
				callback();
			});
	}

	_final(callback) {
		this._client.quit()
			.then( ()=>{
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
	 * @param {object} params.client redis client
	 * @return {RedisWritableStream}        
	 */
	static createInterface(params) {
		return new RedisWritableStream(params);
	}
}
