
describe('pointless test of index ... ',()=>{

	const redisListStream = require('../../src');

	it('should have read and write instances ...',()=>{
		expect(redisListStream.RedisWritableStream).toBeTruthy();
		expect(redisListStream.RedisReadableStream).toBeTruthy();
	})
});