const redis = require('redis');

describe('redis-readable-stream', () => {
	const RedisReadableStream = require('../../src/redis-readable-stream');

	let redisClient;
	let mockPayload;
	beforeEach(() => {

		// mock redis commands 
		spyOn(redis,'commandOptions').and.callFake(()=>{
			return true;
		});
		redisClient = jasmine.createSpyObject('redisClient',['brPop']);

		spyOn(redisClient,'brPop').and.callFake(()=>{
			return Promise.resolve(mockPayload);
		});
	});

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

	it('should create an interface ',()=>{
		const mockClient = RedisReadableStream.createInterface({client:'x'});

		expect(mockClient.client).toBe('x');		
	});
});