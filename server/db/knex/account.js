const knex = require('./connection');

/**
 * Update an email address for an account.
 * @param {string} id - The account ID.
 * @param {string} email - The new email addess value.
 * @returns {Array} - An empty array if the update was unsuccessful, or an array with a single
 * object containting the account ID of the row that was updated.
 * @throws Throws an Error if no email is provided.
 * @throws Throws an Error if an invalid id string is provided.
 * @throws Throws an Error if email is greater than 30 chars in length&.
 * @example
 * updateEmail('1', 'some@email.com'); // { id: '1' }
 */
function updateEmail(id, email) {
  return knex('Account').update({ email }, ['id']).where({ id, exists: true });
}

module.exports = {
  create: {
    register: (username, email, password) => knex('Account')
      .insert({
        username,
        email,
        password,
        exists: true,
      }),
  },
  read: {
    privateInfo: username => knex('Account')
      .select('id', 'email')
      .where({
        username,
        exists: true,
      }),
    publicInfo: username => knex('Account').select('id').where({ username, exists: true }),
    password: id => knex('Account').select('password').where({ id, exists: true }),
  },
  /**
   * @namespace
   * @borrows updateEmail as email
   */
  update: {
    email: updateEmail,
    password: (id, password) => knex('Account').update({ password }).where({ id }),
    existence: (id, exists) => knex('Account').update({ exists }).where({ id }),
  },
};
