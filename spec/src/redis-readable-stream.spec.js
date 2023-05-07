describe('redis-readable-stream', () => {
	const RedisReadableStream = require('../../src/redis-readable-stream');

	let redisClient;
	let mockPayload;
	beforeEach(() => {

		redisClient = jasmine.createSpyObj('redisClient',['brPop']);

		redisClient.brPop.and.callFake(()=>{
			return Promise.resolve(mockPayload);
		});
	});
/*
	it('should read an entry where _id is preset', (done) => {
		mockPayload = {_id:1,message:JSON.stringify({id:1})};

		const stream = new RedisReadableStream({
			queueName: 'ns',
			client: redisClient
		});
		
		stream.on('data',(raw)=>{
			const entry = JSON.parse(raw);
			expect(entry).toBeTruthy();
			expect(entry._id).toBe(1);
			expect(JSON.parse(entry.data).id).toBe(1);
			done();
		});
	});

	it('should read an entry where _id is set to uuid', (done) => {
		mockPayload = JSON.stringify({data:JSON.stringify({id:1})});
		const stream = new RedisReadableStream({
			queueName: 'ns',
			client: redisClient
		});

		stream.on('data',(raw)=>{
			const entry = JSON.parse(raw);
			expect(entry).toBeTruthy();
			expect(entry._id).toBeTruthy();
			expect(JSON.parse(entry.data).id).toBe(1);
			done();
		});
	});

	it('should create a new stream with default queue name',()=>{
		const stream = new RedisReadableStream({
			client: redisClient
		});
		expect(stream.queueName).toBe('rfs');
	});
*/
	it('should throw queue name is undefined',()=>{
		expect(RedisReadableStream.createInterface({client:'x'})).toThrowError('RedisReadableStream  : queue name is undefined');
	});

	it('should throw queue name is undefined',()=>{
		expect(RedisReadableStream.createInterface({queueName:'x'})).toThrowError('RedisReadableStream  : redis client is undefined');
	});
});

