'use strict';
const {
	Readable
} = require('stream');
const { v4: uuidv4 } = require('uuid');

module.exports = class RedisReadableStream extends Readable {
	/**
	 * default constructor of RedisReadbleStream
	 * @param {object} params
	 * @param {string} params.queueName name of the queue where the message will be read.
	 * @param {object} params.client instance of redis client
	 * @return {[type]}        [description]
	 */
	constructor(params) {
		super(params);
		this.counter=0;
		this._validate(params);
		this._queueName = params.queueName;
		this._client = params.client;

		// clien is ready ... 
		this._client.on('ready',()=>{
			this.resume();			
		});

		this._client.on('error',()=>{
			this.pause();
		});

		this.pause(); // pause stream ... 
	}

	_validate(params) {

		if (!params.queueName) {
			throw new Error('RedisReadableStream  : queue name is undefined');
		}

		if (!params.client) {
			throw new Error(`RedisReadableStream : redis client is undefined`);
		}
	}

	_read() {
		this._client.brPop(this._queueName,0)
			.then((entry)=>{
				this.counter++;
				const data = JSON.parse(entry.element);
				// add guid is not one is present ..
				if (!data._id) {
					data._id = uuidv4();
				}
				data.counter = this.counter;
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
	 * @param {Object} params configuration parameters
	 * @param {string} params.queueName name of the list to read messages from 
	 * @param {?Object} params.client optional ready made client
	 * @return {RedisReadbaleStream}   
	 */
	static createInterface(params) {
		if (!params.client) {
			// we need to add a redis client
		}
		return new RedisReadableStream(params);
	}
}