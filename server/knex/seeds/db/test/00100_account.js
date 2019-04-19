/**
 * Seed the Account table with data.
 */
const data = require('../../data');

module.exports = {
  seed: async (knex) => {
    try {
      await knex('Account').del(); // Wait for ALL existing entries to be deleted first.
      // Then seed the table.
      await knex('Account').insert(data.account); // Returns a Promise, for knex.
    } catch (e) { throw e; } // Await functions will silently fail when not caught.
  },
};
