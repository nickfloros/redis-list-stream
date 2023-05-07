describe('redis-writable-stream', () => {
	const RedisWritableStream = require('../../src/redis-writable-stream');

	let redisClient ;
	let mockPayload;
	
	beforeEach(() => {
		redisClient = jasmine.createSpyObj('redisClient',['rPush','on']);

		redisClient.rPush.and.callFake((listNane, payload, cb) => {
			cb();
		});
		redisClient.on.and.callFake((cb)=>{
			cb();
		});
	});
/*
	it('should write an entry where _id is preset', () => {
		mockPayload = JSON.stringify({
			_id: 1,
			data: JSON.stringify({
				id: 1
			})
		});
		const stream = new RedisWritableStream({
			queueName: 'ns',
			client: redisClient
		});

		stream.write(mockPayload);
		expect(redisClient.rpush).toHaveBeenCalled();
	});

	it('should write an entry where _id is not present', () => {
		mockPayload = JSON.stringify({
			data: JSON.stringify({
				id: 1
			})
		});
		const stream = new RedisWritableStream({
			queueName: 'ns',
			client: redisClient
		});

		stream.write(mockPayload);
		expect(redisClient.rpush).toHaveBeenCalled();

	});

	it('should create a new stream with default queue name',()=>{
		const stream = new RedisWritableStream({
			client: redisClient
		});
		expect(stream.queueName).toBe('rfs');
	});

	it('should create an interface ',()=>{
		const mockClient = RedisWritableStream.createInterface({client:'x', queueName:'q'});

		expect(mockClient.client).toBe('x');		
	});
*/

	it('should throw queue name is undefined',()=>{
		expect(RedisWritableStream.createInterface({client:'x'})).toThrowError('RedisWritableStream :queue name is undefined');
	});


	it('should throw redis client is undefined',()=>{
		expect(RedisWritableStream.createInterface({queueName:'x'})).toThrowError('Error : RedisWritableStream  : client is undefined');
	
	});
});