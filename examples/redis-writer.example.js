require('dotenv').config();
const redisClient = require('./redis-client');
const {RedisWritableStream} = require('../index');

// const config = require('dotenv').config({
// 	path: __dirname + '/.env'
// });

const stream = RedisWritableStream.createInterface({
	client : redisClient,
	queueName: 'ns'
});

stream.on('close',()=>{
	process.exit(0);
});

stream.write(JSON.stringify({
	test: 1,
	date: new Date()
}));

redisClient.connect().then(()=>{
	stream.end();
	console.log('end send ... ');
});
