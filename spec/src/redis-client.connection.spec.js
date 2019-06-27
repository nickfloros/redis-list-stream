describe('redis-client', () => {

	const RedisClient = require('../../src/redis-connection');
	const redis = require('redis');

	beforeEach(()=>{
		spyOn(redis,'createClient').and.callFake(()=>{
			return 'y';
		});

	});

	it('use the client passed  ..', () => {
		const mockClient =RedisClient.create({client :'x'});
		expect(mockClient).toBe('x');
	});


	it('create new client with properties passed in the parameters', () => {
		const mockClient =RedisClient.create({redis : {host : 'x', port : 'y'}});
		expect(mockClient).toBe('y');
	});

	it('create new client with no properties passed in the parameters', () => {
		process.env,REDIS_HOST = 'R1';
		process.env.REDIS_PORT = '321'
		const mockClient =RedisClient.create();
		expect(mockClient).toBe('y');
		expect(redis.createClient).toHaveBeenCalled();
	});

	it('create new client with empty properties passed in the parameters', () => {
		process.env,REDIS_HOST = 'R1';
		process.env.REDIS_PORT = '321'
		const mockClient =RedisClient.create({});
		expect(mockClient).toBe('y');
		expect(redis.createClient).toHaveBeenCalled();
	});

});
