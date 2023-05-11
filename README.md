# redis-list-stream
[![GitHub build](https://github.com/nickfloros/redis-list-stream/actions/workflows/build.js.yml/badge.svg?branch=master)](https://github.com/nickfloros/redis-list-stream/actions/workflows/build.js.yml) [![Codacy Badge](https://app.codacy.com/project/badge/Grade/f56bb9a8ad374d15af01205d1196fac2)](https://app.codacy.com/gh/nickfloros/redis-list-stream/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)

Redis supports implementation of a message queue using FIFO lists 
This is a trivial implementation of a such a message queue but with the addtion of a stream based interface. 

The library has been build using redis package version 4.4.6 for more see [redis](https://github.com/NodeRedis/node_redis) [release](https://github.com/redis/node-redis/releases/tag/redis%404.6.6)

Messages in Redis are persisted in a list. Messages are writen using ```rPush``` ,push data at the end of the list, while reads are implemented using ```blPop```, blocked pop from the head of list. Streams is a natural programming abastraction for respective write and read functions. 

For writes the assumption is that the application will trust REDIS to persist the message, in a fire and forget kind mode. 

```javascript
const {RedisWriteableStream, RedisConnection} = require('redis-list-stream');

const client = RedisConnection.create({
	host : proces.env.REDIS_HOST,
	port : parseInt(process.env.REDIS_PORT),
	password : process.env.REDIS_PASSWORD,
	tls : true
});

stream = RedisWriteableStream.createInterface({
	client,
	queueName : 'myQueue'
});

stream.write(JSON.stringify({
	test: 1,
	date: new Date()
}));

stream.end();

stream.on('finish',()=>{
	console.log('message posted');
	process.exit(0);
});

// for redis client 4.x connection is async
client.connect()
	.then(()=>{
		console.log('redis client connected);
	})
	.catch((err)=>{
		console.log(`redis client failed to connect`);
		console.log(err);
		process.exit(1);
	});
````
### RedisWritableStream.createInterface()
Create an instrance of RedisWritableStream

	* RedisWritableStream.createInterface(options)

### `options` object properties
| Property  | Description |
| ----------|-------------|
|queueName  | name of the queue / list created in Redis. A new list will be created if it does not exists otherwise will use the existing one |
|client     | a redis connection to be used by this class. Ideally this connection shouldn't be shared with other redis transactions |

At the moment the write implementation is rather inneficient as it does not 'batch' the writes, but that is for something for the very near future.

In addition the current implementation does not offer any mechanism for alerting the calling program of success or failure of the underlying ```rPush```. Again this is somehting that will be addressed very soon.

For reads the implentation is equally simple
```javascript
const {RedisReadableStream, RedisConection} = require('redis-list-stream');

const client = RedisConnection.create({
	host : proces.env.REDIS_HOST,
	port : parseInt(process.env.REDIS_PORT),
	password : process.env.REDIS_PASSWORD,
	tls : true
});
stream = RedisReadableStream.createInterface({
	client,
	queueName : 'myQueue'
});

stream.on('data',(data)=>{
	console.log(data.toString());
});

// for redis client 4.x connection is async
client.connect()
	.then(()=>{
		console.log('redis client connected);
	})
	.catch((err)=>{
		console.log(`redis client failed to connect`);
		console.log(err);
		process.exit(1);
	});
```

The library will pop one message at a time from from the queue and generate the ```data``` event. Another way to is implement a ```Tansform``` stream responsible of implementing the actions a process has to do when receives an message . The example below does exactly the same as the previous example. 

```javascript
const {RedisReadableStream, RedisConnection} = require('redis-list-stream');
const {Transform} = require('stream');

const client = RedisConnection.create({
	host : proces.env.REDIS_HOST,
	port : parseInt(process.env.REDIS_PORT),
	password : process.env.REDIS_PASSWORD,
	tls : true
});

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
	client,
	queueName : 'myQueue'
});

stream.pipe(tStream);
// for redis client 4.x connection is async
client.connect()
	.then(()=>{
		console.log('redis client connected);
	})
	.catch((err)=>{
		console.log(`redis client failed to connect`);
		console.log(err);
		process.exit(1);
	});
```

### RedisWritableStream.createInterface()
Create an instrance of RedisWritableStream

	* RedisWritableStream.createInterface(options)

### `options` object properties
| Property  | Description |
| ----------|-------------|
|queueName  | name of the queue / list created in Redis. A new list will be created if it does not exists otherwise will use the existing one |
|client     | a redis connection to be used by this class. Ideally this connection shouldn't be shared with other redis transactions |

### RedisConnection.create
A simple implementation of creating a redis connection. Adviced user use their own 
### `options` object properties
| Property  | Description |
| ----------|-------------|
|host       | where Redis service is hosted
|port       | post Redis server is listening for connections
|password   | password to connect
|tls        | set to try for TLS connection e.g. to AZURE