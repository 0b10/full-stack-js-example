/**
 * Create the post table.
 * knex expects these functions to return a promise - async functions return a promise.
 */
exports.up = async (knex) => { // Migrate up.
  try {
    await knex.schema
      .createTable('Post', (table) => {
        table.bigIncrements('id');
        table.string('title', 100).notNullable();
        table.text('body').notNullable(); // Text type. Normal length type == 65kb.
        table.timestamp('created_at'); // Automagic timestamp.
        table.bigInteger('poster_id').notNullable(); // Explicit declaration of foreign key field.
        table.foreign('poster_id').references('id').inTable('Account'); // Now make it foreign key.
      });
  } catch (e) { throw e; } // Await functions fail silently unless they are caught.
};

exports.down = async (knex) => { // Migrate down; rollback.
  try {
    await knex.schema.dropTable('Post');
  } catch (e) { throw e; }
};
