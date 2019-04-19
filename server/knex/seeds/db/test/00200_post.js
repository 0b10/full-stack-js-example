/**
 * Seed the Post table with data.
 */
const data = require('../../data');

module.exports = {
  seed: async (knex) => {
    await knex('Post').del(); // Wait for deletion first.
    await knex('Post').insert(data.post); // Return a Promise to knex, because db ops are async.
  },
};
