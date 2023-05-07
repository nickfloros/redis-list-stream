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
		expect(mockClient).toBe('y');
	});

});
