
const RedisReadableStream = require('./src/redis-readable-stream');
const RedisWritableStream = require('./src/redis-writable-stream');
console.log(RedisWritableStream);
module.exports = {
	RedisWritableStream, RedisReadableStream
};