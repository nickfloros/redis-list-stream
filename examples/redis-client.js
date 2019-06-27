const config = require('dotenv').config();
const	redis = require('redis');


const redisClient = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
console.log(redisClient);
redisClient.on('connect',()=>{
	console.log('redis... connected');

});


module.exports = redisClient;

