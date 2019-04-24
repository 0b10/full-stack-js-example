/**
 * Create the post table.
 * knex expects these functions to return a promise - async functions return a promise.
 */
exports.up = knex => knex.schema.createTable('Post', (table) => { // Upgrade.
  table.bigIncrements('id');
  table.string('title', 100).notNullable();
  table.text('body').notNullable(); // Text type. Normal length type == 65kb.
  table.boolean('hidden').defaultTo(false); // Posts are hidden, not deleted.
  table.timestamp('created_at').defaultTo(knex.fn.now()); // Automagic timestamp.
  table.bigInteger('poster_id').notNullable(); // Explicit declaration of foreign key field.
  table.foreign('poster_id').references('id').inTable('Account'); // Now make it foreign key.
});

exports.down = knex => knex.schema.dropTable('Post'); // Rollback.
