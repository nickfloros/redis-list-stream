const config = require('dotenv').config({path:__dirname+'/.env'});

const redisClient = require('./redis-client');

const {RedisWritableStream} = require('../index');
console.log(RedisWritableStream);
const stream = new RedisWritableStream({
	client : redisClient,
	queueName : 'ns'
});

stream.write(JSON.stringify({test:1, date : new Date()}));

stream.end();

