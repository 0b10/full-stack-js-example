/* eslint-disable no-undef */
const knex = require('../../../db/knex/connection');
const db = require('../../../db');
const data = require('../../../knex/seeds/data');

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

describe('All database operations', () => {
  const behaviours = [
    db.account.create.register,
    db.account.read.privateInfo,
    db.account.read.publicInfo,
    db.account.read.password,
    db.account.update.email,
    db.account.update.password,
    db.account.update.enable,
    db.account.update.disable,
    db.post.create.new,
    db.post.read.byId,
    db.post.update.edit,
    db.post.update.hide,
    db.post.update.unhide,
  ];
  behaviours.forEach((behaviour) => {
    it('should reject promise with { error: true } for no params.', async () => behaviour()
      .catch(retval => expect(retval).toEqual({ error: true })));
  });
});
