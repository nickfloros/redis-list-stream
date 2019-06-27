const config = require('dotenv').config({path:__dirname+'/.env'});


const {RedisReadableStream} = require('../index');
const redisClient = require('../src/redis-connection');

const stream = new RedisReadableStream({
		client : redisClient.create(),
		queueName : 'ns'
});

stream.on('data',(data)=>{
	console.log(data.toString());
});



