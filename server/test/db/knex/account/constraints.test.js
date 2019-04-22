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

    describe('publicInfo()', () => {
      it('should only return a record when "exists" is set to true.', async () => {
        const user1Result = db.account.read.publicInfo('user1'); // "exists" set to true.
        const user2Result = db.account.read.publicInfo('user2'); // "exists" set to false.
        return Promise.all([user1Result, user2Result])
          .then(([result1, result2]) => {
            expect(result1).toHaveLength(1);
            expect(result2).toHaveLength(0);
          });
      });
      it('should return an empty record given an invalid username.', async () => {
        const result = await db.account.read.publicInfo('12983678621763');
        expect(result).toHaveLength(0);
      });
      it('should return an empty record given an invalid username type.', async () => {
        const result = await db.account.read.publicInfo(12345);
        expect(result).toHaveLength(0);
      });
    });

    describe('password()', () => {
      it('should only return a record when "exists" is set to true.', async () => {
        const user1Result = db.account.read.password('1'); // "exists" set to true.
        const user2Result = db.account.read.password('2'); // "exists" set to false.
        return Promise.all([user1Result, user2Result])
          .then(([result1, result2]) => {
            expect(result1).toHaveLength(1);
            expect(result2).toHaveLength(0);
          });
      });
      it('should return an empty record given a non-existent username.', async () => {
        const result = await db.account.read.password('12983678621763');
        expect(result).toHaveLength(0);
      });
      it('should return an error given an invalid username type.', () => { // eslint-disable-line arrow-body-style
        return db.account.read.password('astring')
          .catch(e => expect(e).toBeDefined());
      });
    });
  });

  describe('"Update" operations', () => {
    describe('email()', () => {
      it('should only update a record when "exists" is set to true.', async () => {
        // Test accounts that both do and do not 'exists'.

        return Promise.all([
          db.account.update.email('1', 'newtest@email.com'), // "exists" set to true.
          db.account.update.email('2', 'newtest@email2.com'), // "exists" set to false.
        ])
          .then(([result1, result2]) => {
            expect(result1).toHaveLength(1);
            expect(result2).toHaveLength(0);
            expect(result1[0]).toEqual({ id: '1' });
          });
      });
      // it('should return an empty record given a non-existent username.', async () => {
      //   const result = await db.account.update.email('12983678621763');
      //   expect(result).toHaveLength(0);
      // });
      // it('should return an error given an invalid username type.', () => { // eslint-disable-line arrow-body-style
      //   return db.account.update.email('astring')
      //     .catch(e => expect(e).toBeDefined());
      // });
    });
  });
});
