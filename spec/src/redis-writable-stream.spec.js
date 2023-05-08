describe('redis-writable-stream', () => {
	const RedisWritableStream = require('../../src/redis-writable-stream');
	const EventEmitter = require('events');

	let testStream;
	let mockPayload;
	let mockRedisClient;
	const queueName='ns';

	beforeEach(() => {
		mockPayload = {bob:1};

		mockRedisClient = new EventEmitter();
		mockRedisClient.rPush = jasmine.createSpy().and.callFake(()=>{
			mockRedisClient.emit('done');
			return Promise.resolve();
		});

		mockRedisClient.quit = jasmine.createSpy().and.callFake(()=>{
			return Promise.resolve();
		});

		testStream = new RedisWritableStream({
			queueName,
			client : mockRedisClient
		});

	});

	it('should have a RedisWriteableStream in paused state',()=>{
		expect(testStream).toBeTruthy();
		expect(testStream.writableCorked).toBe(1);
		expect(mockRedisClient.rPush).toBeDefined();
		expect(mockRedisClient.quit).toBeDefined();

		expect(testStream.queueName).toBe(queueName);
		expect(testStream.client).toBe(mockRedisClient);
	});

	it('should be writable once ready is emit',()=>{
		mockRedisClient.emit('ready');
		expect(testStream.writableCorked).toBe(0); // this means that we are writebale 
	});

	it('should write to mockRedis client with _id precent',(done)=>{
		mockPayload = {_id:1, bob:1};
		mockRedisClient.emit('ready');
		testStream.write(JSON.stringify(mockPayload));
		testStream.end();
		testStream.on('close',()=>{
			expect(mockRedisClient.rPush).toHaveBeenCalled();
			done();
		});
	});

	it('should write to mockRedis client with _id not precent',(done)=>{
		mockRedisClient.emit('ready');
		testStream.write(JSON.stringify(mockPayload));
		testStream.end();
		testStream.on('close',()=>{
			expect(mockRedisClient.rPush).toHaveBeenCalled();
			done();
		});
	});

	it('should throw queue name is undefined',()=>{

		try {
			RedisWritableStream.createInterface({client:'x'});
		}	
		catch (e) {
			expect(e.message).toContain('queue');
		}
	});


	it('should throw redis client is undefined',()=>{
		try {
			RedisWritableStream.createInterface({queueName:'x'});
		}
		catch(e) {
			expect(e.message).toContain('redis client');
		}
	});
});