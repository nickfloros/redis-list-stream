describe('redis-writable-stream', () => {
	const RedisWritableStream = require('../../src/redis-writable-stream');

	let redisClient = {
		rpush: function() {}
	};
	let mockPayload
	beforeEach(() => {

		spyOn(redisClient, 'rpush').and.callFake((listNane, payload, cb) => {
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

});