const redisConnection = require('../src/redis-connection');

const redisConfig = { // see https://github.com/redis/node-redis/blob/master/docs/client-configuration.md
	socket : {
		host : process.env.REDIS_HOST,
		port : parseInt(process.env.REDIS_PORT,10),
		tls : true,
		keepAlive : 5000,
		reconnectStrategy : 100
	},
	password : process.env.REDIS_PASSWORD
}

const redisClient = redisConnection.create(redisConfig);

redisClient.on('connect',()=>{
	console.log('redis... connected');
});

module.exports = redisClient;

