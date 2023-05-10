describe('redis-client', () => {

	const RedisClient = require('../../src/redis-connection');
	const redis = require('redis');

	beforeEach(()=>{
		spyOn(redis,'createClient').and.callFake(async ()=>{
			return Promise.resolve('y');
		});

	});

	it('should throw an exception that host is missing.', async (done) => {
		try {
			await RedisClient.create({});
		}
		catch (err) {
			expect(err.message).toContain('missing host')
			done();
		}
	});
	it('should throw an exception that port is missing.', async (done) => {
		try {
			await RedisClient.create({host:'x'});
		}
		catch (err) {
			expect(err.message).toContain('missing port')
			done();
		}
	});

	it('should throw an exception that password is missing.', async (done) => {
		try {
			await RedisClient.create({host:'x', port : 1});
		}
		catch (err) {
			expect(err.message).toContain('missing password')
			done();
		}
	});

	it('should return a client', async (done) => {
		const client = await RedisClient.create({host:'x', port : 1, password:'x'});
		expect(client).toBe('y');
		done();
	});

});
