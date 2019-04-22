/* eslint-disable no-undef */
const knex = require('../../../../db/knex/connection');
const db = require('../../../../db');
const data = require('../../../../knex/seeds/data');

// beforeEach, afterEach is called once between tests.
beforeEach(async () => {
  // Setup/teardown in jest can handle retuned promises, or use done() for async calls.
  await knex.migrate.rollback();
  await knex.migrate.latest();
  return knex.seed.run(); // Return the promise.
});

// knex.destroy() expects a callback, or to be chained as a promise.
// beforreAll, and afterAll are called once per module.
afterAll(() => knex.destroy(() => console.log('DB pooling connection destroyed.')));

describe('The database "Account" table', () => {
  describe('"Read" operations', () => {
    describe('privateInfo()', () => {
      it('should only return a record when "exists" is set to true.', async () => {
        const user1Result = db.account.read.privateInfo('user1'); // "exists" set to true.
        const user2Result = db.account.read.privateInfo('user2'); // "exists" set to false.
        return Promise.all([user1Result, user2Result])
          .then(([result1, result2]) => {
            expect(result1).toHaveLength(1);
            expect(result2).toHaveLength(0);
          });
      });
      it('should return an empty record given an invalid username.', async () => {
        const result = await db.account.read.privateInfo('12983678621763');
        expect(result).toHaveLength(0);
      });
      it('should return an empty record given an invalid username type.', async () => {
        const result = await db.account.read.privateInfo(12345);
        expect(result).toHaveLength(0);
      });
    });
  });
});
