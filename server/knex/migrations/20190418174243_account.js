/**
 * Create the database schema.
 * knex expects these functions to return a promise - async functions return a promise.
 */
exports.up = async (knex) => { // Migrate up.
  try {
    await knex.schema
      .createTable('Account', (table) => {
        table.bigIncrements('id'); // Primary key, and BIGINT, for lots of users etc.
        table.string('username', 20).notNullable(); // 'String' is VARCHAR type.
        table.string('email', 30).notNullable();
        table.string('password', 64).notNullable(); // Will store sha256 @ 64 hex chars.
      }); // Chaining seems to create all tables correctly, multiple awaits do not.
  } catch (e) { throw e; } // Await functions fail silently unless they are caught.
};

exports.down = async (knex) => { // Migrate down; rollback.
  try {
    await knex.schema.dropTable('Account');
  } catch (e) { throw e; }
};
