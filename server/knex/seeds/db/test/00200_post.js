/**
 * Seed the Post table with data.
 */
const data = require('../../data');

exports.seed = async (knex) => {
  await knex('Post').del(); // Wait for deletion first.
  return knex('Post').insert(data.post); // Return a Promise to knex.
};
