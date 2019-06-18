
const {Readable} = require('stream');
const uuidv1 = require('uuid/v1');

module.exports = class RedisReadableStream extends Readable {
	constructor(params) {
		super(params);
		this._listName = params.listName;
		this._client = params.client;
	}

	_read(size) {
		this._client.brpop(this._listName, 0, (err, entry) => {
			const data = JSON.parse(entry[1]);
			if (!data._id) {
				data._id = uuidv1();
			}
			this.push(JSON.stringify(data));
		});
	}
}
