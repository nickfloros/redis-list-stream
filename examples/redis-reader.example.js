const config = require('dotenv').config({path:__dirname+'/.env'});

const redisClient = require('./redis-client');

const {RedisReadableStream} = require('../index');

const stream = new RedisReadableStream({
	client : redisClient,
	listName : 'ns'
});

stream.on('data',(data)=>{
	console.log(data.toString());
});



