describe('redis-writable-stream', () => {
	const RedisWritableStream = require('../../src/redis-writable-stream');

	let redisClient = {
		rPush: function() {}
	};
	let mockPayload
	beforeEach(() => {

		spyOn(redisClient, 'rPush').and.callFake((listNane, payload, cb) => {
			cb();
		});

	});

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
		const mockClient = RedisWritableStream.createInterface({client:'x'});

		expect(mockClient.client).toBe('x');		
	});
});