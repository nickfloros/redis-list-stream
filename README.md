# redis-list-stream
[![GitHub build](https://github.com/nickfloros/redis-list-stream/actions/workflows/build.js.yml/badge.svg?branch=master)](https://github.com/nickfloros/redis-list-stream/actions/workflows/build.js.yml) [![Codacy Badge](https://app.codacy.com/project/badge/Grade/f56bb9a8ad374d15af01205d1196fac2)](https://app.codacy.com/gh/nickfloros/redis-list-stream/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)

Redis supports implementation of a message queue using FIFO lists 
This is a trivial implementation of a such a message queue but with the addtion of a stream based interface. 

Messages in Redis are persisted in a list. Messages are writen using ```rpush``` ,push data at the end of the list, while reads are implemented using ```blpop```, blocked pop from the head of list. Streams is a natural programming abastraction for respective write and read functions. 

For writes the assumption is that the application will trust REDIS to persist the message, in a fire and forget kind mode. 

```javascript
const {RedisWriteableStream} = require('redis-list-stream');

stream = RedisWriteableStream.createInterface({
	redis: {
		host: process.env.REDIS_HOST || 'localhost',
		port: process.env.REDIS_PORT || 8120
	},
	queueName : 'myQueue'
});

stream.write(JSON.stringify({
	test: 1,
	date: new Date()
}));

stream.end();

stream.on('finish',()=>{
	process.exit(0);
});

````
### RedisWritableStream.createInterface()
Create an instrance of RedisWritableStream

* RedisWritableStream.createInterface(options)

### `options` object properties
| Property  | Description |
| ----------|-------------|
|redis      | contains normal redis parameters for creating a connection, for more see [redis](https://github.com/NodeRedis/node_redis#options-object-properties) documentation |
|queueName  | name of the queue / list created in Redis. A new list will be created if it does not exists otherwise will use the existing one |
|client     | a redis connection to be used by this class. Ideally this connection shouldn't be shared with other redis transactions |

At the moment the write implementation is rather inneficient as it does not 'batch' the writes, but that is for something for the very near future.

In addition the current implementation does not offer any mechanism for alerting the calling program of success or failure of the underlying ```rpush```. Again this is somehting that will be addressed very soon.

For reads the implentation is equally simple
```javascript
const {RedisReadableStream} = require('redis-list-stream');

stream = RedisReadableStream.createInterface({
	redis: {
		host: process.env.REDIS_HOST || 'localhost',
		port: process.env.REDIS_PORT || 8120
	},
	queueName : 'myQueue'
});

stream.on('data',(data)=>{
	console.log(data.toString());
});

```
The library will pop one message at a time from from the queue and generate the ```data``` event. Another way to is implement a ```Tanform``` stream responsible of implementing the actions a process has to do when receives an message . The example below does exactly the same as the previous example. 

```javascript
const {RedisReadableStream} = require('redis-list-stream');
const {Transform} = require('stream');

class TestTranform extends Transform {
	constructor(params) {
		super(params);
	}
	_transform(chunk,encoding, cb) {
		console.log(chunk.toString());
		cb();
	}
}
const tStream = new TestTransform();

stream = RedisReadableStream.createInterface({
	redis: {
		host: process.env.REDIS_HOST || 'localhost',
		port: process.env.REDIS_PORT || 8120
	},
	queueName : 'myQueue'
});

stream.pipe(tStream);

```

### RedisWritableStream.createInterface()
Create an instrance of RedisWritableStream

* RedisWritableStream.createInterface(options)

### `options` object properties
| Property  | Description |
| ----------|-------------|
|redis      | contains normal redis parameters for creating a connection, for more see [redis](https://github.com/NodeRedis/node_redis#options-object-properties) documentation |
|queueName  | name of the queue / list created in Redis. A new list will be created if it does not exists otherwise will use the existing one |
|client     | a redis connection to be used by this class. Ideally this connection shouldn't be shared with other redis transactions |

