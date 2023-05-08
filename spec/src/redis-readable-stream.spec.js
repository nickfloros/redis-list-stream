
describe('redis-readable-stream', () => {
	const RedisReadableStream = require('../../src/redis-readable-stream');
	const {EventEmitter} = require('events');

	let mockRedisClient ;
	let mockPayload;
	let testStream;
	const queueName ='ns';

	beforeEach(() => {
		mockPayload = { key : 'ns',element : JSON.stringify({bob:1})};

		mockRedisClient = new EventEmitter();
		mockRedisClient.brPop = jasmine.createSpy().and.callFake(()=>{
			return Promise.resolve(mockPayload);
		});

		testStream = new RedisReadableStream({
			queueName,
			client: mockRedisClient
		});

	});

	it('should create a RedisReadableStream in paused state',()=>{
		expect(testStream).toBeTruthy();
		expect(testStream.isPaused()).toBeTrue();
		expect(mockRedisClient.brPop).toBeDefined();

		expect(testStream.queueName).toBe(queueName);
		expect(testStream.client).toBe(mockRedisClient);
	});

	it('should read an entry where _id is not set', (done) => {
		mockRedisClient.emit('ready');
		testStream.on('data',(raw)=>{
			const entry = JSON.parse(raw.toString());
			testStream.pause(); // we need to stop the stream ... 

			expect(entry).toBeTruthy();
			expect(entry._id).toBeDefined();
			expect(entry.bob).toBe(1);
			testStream.destroy(); // need to destry stream ... 
			done();
		});
	});

	it('should read an entry where _id is set', (done) => {
		mockPayload = { key : 'ns',element : JSON.stringify({_id:2,bob:1})};

		mockRedisClient.emit('ready');
		testStream.on('data',(raw)=>{
			const entry = JSON.parse(raw.toString());
			testStream.pause(); // we need to stop the stream ... 

			expect(entry).toBeTruthy();
			expect(entry._id).toBe(2);
			expect(entry.bob).toBe(1);
			testStream.destroy(); // need to destry stream ... 
			done();
		});
	});


	it('should create a new stream with default queue name',()=>{
		const pauseFunc = testStream.pause;

		spyOn(testStream,'pause').and.callFake(pauseFunc);
		mockRedisClient.emit('error');
		expect(testStream.pause).toHaveBeenCalled();		
	});

	it('should throw queue name is undefined',()=>{
		try {
			RedisReadableStream.createInterface({client:'x'});
		}
		catch (e) {
			expect(e.message).toContain('queue');
		}
	});

	it('should throw queue name is undefined',()=>{
		try {
			RedisReadableStream.createInterface({queueName:'x'});
		}
		catch (e) {
			expect(e.message).toContain('redis client is undefined');
		}
	});
});

