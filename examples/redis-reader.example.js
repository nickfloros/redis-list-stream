require('dotenv').config();
const redisClient = require('./redis-client');
const {RedisReadableStream} = require('../index');

const stream = new RedisReadableStream({
		client : redisClient,
		queueName : 'ns'
});

stream.on('data',(data)=>{
	console.log('xx-'+data.toString());
});


 redisClient.connect().then(()=>{
 	console.log('client connected');
 });
