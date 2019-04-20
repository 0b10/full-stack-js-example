/**
 * Seed the Account table with data.
 */
const data = require('../../data');

exports.seed = async (knex) => {
  await knex('Account').del(); // Wait for ALL existing entries to be deleted first.
  // Then seed the table.
  return knex('Account').insert(data.account); // Returns a Promise, for knex.
};
