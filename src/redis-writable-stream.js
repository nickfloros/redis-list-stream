

const {Writable} = require('stream');
const uuidv1 = require('uuid/v1');

module.exports = class RedisWritableStream extends Writable {
	constructor(params) {
		super(params);
		this._client = params.client;
		this._queueName = params.queueName;

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

}
