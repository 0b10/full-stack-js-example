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
  describe('"Create" operations', () => {
    it('register(): Should add a username, email, and a password.', async () => {
      await db.account.create
        .register('test_username', 'test@email.com', 'atestpassword');

      const result = await knex('Account')
        .select('username', 'email', 'password')
        .where({ username: 'test_username' });

      expect(result[0]).toEqual({
        username: 'test_username',
        email: 'test@email.com',
        password: 'atestpassword',
      });
    });
  });

  describe('"Read" operations', () => {
    it('privateInfo(): Should return a user\'s ID and email, given a username.', async () => {
      const { username, email } = data.account[0]; // The seed data module.
      const result = await db.account.read.privateInfo(username);
      expect(result[0]).toEqual({ id: '1', email }); // toEqual is a shallow copy, and not same ref
    });
    it('publicInfo(): Should return a user\'s ID, given a username.', async () => {
      const { username } = data.account[0]; // The seed data module.
      const result = await db.account.read.publicInfo(username);
      expect(result[0]).toEqual({ id: '1' });
    });
    it('password(): Should return a user\' password, given a user ID.', async () => {
      const { password } = data.account[0];
      const result = await db.account.read.password('1');
      expect(result[0]).toEqual({ password });
    });
  });

  describe('"Update" operations', () => {
    it('email(): Should set a email, for a user, given the user ID and new email.', async () => {
      await db.account.update.email('1', 'newtest@email.com');
      const result = await knex('Account').select('email').where({ id: '1' });
      expect(result[0]).toEqual({ email: 'newtest@email.com' });
    });
    it('password(): Should set a new password, given the user ID and new password.', async () => {
      await db.account.update.password('1', 'newtestpassword');
      const result = await knex('Account').select('password').where({ id: '1' });
      expect(result[0]).toEqual({ password: 'newtestpassword' });
    });
    it('existence(): Should update "exists" with the given boolean value.', async () => {
      await db.account.update.existence('1', false);
      const result = await knex('Account').select('exists').where({ id: '1' });
      expect(result[0]).toEqual({ exists: false });
    });
  });
});
