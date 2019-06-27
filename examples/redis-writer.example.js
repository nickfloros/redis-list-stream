
const config = require('dotenv').config({
	path: __dirname + '/.env'
});

const {
	RedisWritableStream
} = require('../index');
console.log(RedisWritableStream);

const stream = RedisWritableStream.createInterface({
	redis: {
		host: process.env.REDIS_HOST,
		port: process.env.REDIS_PORT
	},
	queueName: 'ns'
});

stream.write(JSON.stringify({
	test: 1,
	date: new Date()
}));

stream.end();

stream.on('finish',()=>{
	process.exit(0);
});