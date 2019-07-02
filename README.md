# redis-list-stream
[![CircleCI](https://circleci.com/gh/nickfloros/redis-list-stream.svg?style=svg)](https://circleci.com/gh/nickfloros/redis-list-stream) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/cf9630a2c0014fce8d5e63a0807d9738)](https://www.codacy.com/app/nickfloros/redis-list-stream?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=nickfloros/redis-stream-list&amp;utm_campaign=Badge_Grade)

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

The parameters are 

 Property name | Description 
---------------|-------------
 redis  | contains normal redis parameters for creating a connection for more see redis documentation 
 queueName | name of the queue / list created in Redis. A new list will be created if it does not exists otherwise will use the existing one 
 client | a redis connection to be used by this class. Ideally this connection shouldn't be shared with other redis transactions 

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
The library will pop one message at a time from from the queue and generate the ```data``` event.

