/**
 * Create the database schema.
 * knex expects these functions to return a promise - async functions return a promise.
 */
exports.up = knex => knex.schema.createTable('Account', (table) => {
  table.bigIncrements('id'); // Primary key, and BIGINT, for lots of users etc.
  table.string('username', 20).notNullable(); // 'String' is VARCHAR type.
  table.string('email', 30).notNullable();
  table.string('password', 64).notNullable(); // Will store sha256 @ 64 hex chars.
  table.boolean('exists').notNullable();
});

exports.down = knex => knex.schema.dropTable('Account');
