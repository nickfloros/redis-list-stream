describe('redis-client', () => {

	const RedisClient = require('../../src/redis-connection');
	const redis = require('redis');

	beforeEach(()=>{
		spyOn(redis,'createClient').and.callFake(()=>{
			return Promise.resolve('y');
		});

	});

	it('should throw an exception that host is missing.', async () => {
		try {
			await RedisClient.create({});
		}
		catch (err) {
			expect(err.message).toContain('missing host')
		}
	});
	it('should throw an exception that port is missing.',  async () => {
		try {
			await RedisClient.create({host:'x'});
		}
		catch (err) {
			expect(err.message).toContain('missing port')
		}
	});

	it('should throw an exception that password is missing.', async () => {
		try {
			await RedisClient.create({host:'x', port : 1});
		}
		catch (err) {
			expect(err.message).toContain('missing password')
		}
	});

	it('should return a client', async () => {
		const client = await RedisClient.create({host:'x', port : 1, password:'x'});
		expect(client).toBe('y');
	});

});
