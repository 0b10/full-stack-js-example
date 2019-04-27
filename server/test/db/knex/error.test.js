/* eslint-disable no-undef */
const knex = require('../../../db/knex/connection');
const db = require('../../../db');

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

describe('All database operations that take args, when given none', () => {
  const funcs = [];
  funcs['account.create.register()'] = db.account.create.register;
  funcs['account.read.privateInfo()'] = db.account.read.privateInfo;
  funcs['account.read.publicInfo()'] = db.account.read.publicInfo;
  funcs['account.read.password()'] = db.account.read.password;
  funcs['account.update.email()'] = db.account.update.email;
  funcs['account.update.password()'] = db.account.update.password;
  funcs['account.update.enable()'] = db.account.update.enable;
  funcs['account.update.disable()'] = db.account.update.disable;
  funcs['post.create.new()'] = db.post.create.new;
  funcs['post.read.byId()'] = db.post.read.byId;
  funcs['post.update.edit()'] = db.post.update.edit;
  funcs['post.update.hide()'] = db.post.update.hide;
  funcs['post.update.unhide()'] = db.post.update.unhide;

  Object.entries(funcs).forEach(([name, func]) => {
    it(`${name}: should return a rejected promise, as a thrown error`, () => expect(func())
      .rejects // Check that the promise is rejected.
      .toThrow()); // Check that it's rejected with Error object. You can check for a message too.
  });
});
