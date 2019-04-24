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
      it('should only return a record when "enabled" is set to true.', async () => {
        const user1Result = db.account.read.privateInfo('user1'); // "enabled" set to true.
        const user2Result = db.account.read.privateInfo('user2'); // "enabled" set to false.
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
      it('should only return a record when "enabled" is set to true.', async () => {
        const user1Result = db.account.read.publicInfo('user1'); // "enabled" set to true.
        const user2Result = db.account.read.publicInfo('user2'); // "enabled" set to false.
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
      it('should only return a record when "enabled" is set to true.', async () => {
        const user1Result = db.account.read.password('1'); // "enabled" set to true.
        const user2Result = db.account.read.password('2'); // "enabled" set to false.
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
      it('should only update a record when "enabled" is set to true.', async () => { // eslint-disable-line arrow-body-style
        // Test both enabled and disabled accounts.

        return Promise.all([
          db.account.update.email('1', 'newtest@email.com'), // "enabled" set to true.
          db.account.update.email('2', 'newtest@email2.com'), // "enabled" set to false.
        ])
          .then(([result1, result2]) => {
            expect(result1).toHaveLength(1);
            expect(result2).toHaveLength(0);
            expect(result1[0]).toEqual({ id: '1' });
          });
      });
      it('should return an empty record given a non-existent id.', async () => {
        const result = await db.account.update.email('12983678621763', 'newtest@email.com');
        expect(result).toHaveLength(0);
      });
      it('should throw an error given no value to update with.', () => { // eslint-disable-line arrow-body-style
        return db.account.update.email('1')
          .catch(e => expect(e).toBeDefined());
      });
      it('should return an error given an invalid account id type.', () => { // eslint-disable-line arrow-body-style
        return db.account.update.email('astring', 'newtest@email.com')
          .catch(e => expect(e).toBeDefined());
      });
      it('should only update a single record.', async () => {
        const result = await db.account.update.email('1', 'newtest@email.com');
        expect(result).toHaveLength(1);
      });
      it('should only update the email field.', async () => {
        await db.account.update.email('1', 'newtest@email.com');
        const result = await knex('Account')
          .select('username', 'email', 'password', 'enabled')
          .where({ id: '1' });
        // Get seed data in a predictable form.
        const { username, password, enabled } = data.account[0];
        expect(result[0]).toEqual({ username, email: 'newtest@email.com', password, enabled });
      });
    });

    describe('password()', () => {
      it('should only update a record when "enabled" is set to true.', async () => { // eslint-disable-line arrow-body-style
        // Test both enabled and disabled accounts.

        return Promise.all([
          db.account.update.password('1', 'newpassword1'), // "enabled" set to true.
          db.account.update.password('2', 'newpassword2'), // "enabled" set to false.
        ])
          .then(([result1, result2]) => {
            expect(result1).toHaveLength(1);
            expect(result2).toHaveLength(0);
            expect(result1[0]).toEqual({ id: '1' });
          });
      });
      it('should return an empty record given a non-existent id.', async () => {
        const result = await db.account.update.password('12983678621763', 'newpassword1');
        expect(result).toHaveLength(0);
      });
      it('should throw an error given no value to update with.', () => { // eslint-disable-line arrow-body-style
        return db.account.update.password('1')
          .catch(e => expect(e).toBeDefined());
      });
      it('should return an error given an invalid account id type.', () => { // eslint-disable-line arrow-body-style
        return db.account.update.password('astring', 'newpassword1')
          .catch(e => expect(e).toBeDefined());
      });
      it('should only update a single record.', async () => {
        const result = await db.account.update.password('1', 'newpassword1');
        expect(result).toHaveLength(1);
      });
      it('should only update the password field.', async () => {
        await db.account.update.password('1', 'newpassword1');
        const result = await knex('Account')
          .select('username', 'email', 'password', 'enabled')
          .where({ id: '1' });
        // Get seed data in a predictable form.
        const { username, email, enabled } = data.account[0];
        expect(result[0]).toEqual({ username, email, password: 'newpassword1', enabled });
      });
    });

    describe('enable()', () => {
      it('should only modify a single record', async () => {
        const result = await db.account.update.enable('2');
        expect(result).toHaveLength(1);
      });
      it('should return the correct id', async () => {
        const result = await db.account.update.enable('2');
        expect(result[0]).toEqual({ id: '2' });
      });
      it('should modify only the "enabled" field', async () => {
        await db.account.update.enable('2');
        const { username, email, password } = data.account[1];
        const result = await knex('Account')
          .select('username', 'email', 'password', 'enabled')
          .where({ id: '2' });
        expect(result[0]).toEqual({ username, email, password, enabled: true });
      });
    });

    describe('disable()', () => {
      it('should only modify a single record', async () => {
        const result = await db.account.update.disable('1');
        expect(result).toHaveLength(1);
      });
      it('should return the correct id', async () => {
        const result = await db.account.update.disable('1');
        expect(result[0]).toEqual({ id: '1' });
      });
      it('should modify only the "enabled" field', async () => {
        await db.account.update.disable('1');
        const { username, email, password } = data.account[0];
        const result = await knex('Account')
          .select('username', 'email', 'password', 'enabled')
          .where({ id: '1' });
        expect(result[0]).toEqual({ username, email, password, enabled: false });
      });
    });
  });

  describe('"Create" operations', () => {
    describe('register()', () => {
      // Tests for modification of only relevant fields is done in the 'simple' test module.
      it('should create only a single record.', async () => {
        const result = await db.account.create
          .register('newtestuser', 'newtest@email.com', 'anewtestpasswordhash');
        expect(result).toHaveLength(1);
      });
      it('should return the correct id', async () => {
        const result = await db.account.create
          .register('djiwrt62$%lkeoi', 'newtest@email.com', 'anewtestpasswordhash');
        const check = await knex('Account')
          .select('id')
          .where({ username: 'djiwrt62$%lkeoi' });
        expect(result[0]).toEqual(check[0]);
      });
    });
  });
});
