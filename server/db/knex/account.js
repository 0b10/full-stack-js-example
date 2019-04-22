const knex = require('./connection');

/**
 * Update an email address for an account.
 * @param {string} id - The account ID.
 * @param {string} email - The new email addess value.
 * @returns {Array} - An empty array if the update was unsuccessful, or an array with a single
 *  object containting the account ID of the row that was updated.
 * @throws Throws an Error if any of the arguments are omitted.
 * @throws Throws an Error if an invalid id string is provided.
 * @throws Throws an Error if email is greater than 30 chars in length.
 * @example
 * updateEmail('1', 'some@email.com'); // { id: '1' }
 */
function updateEmail(id, email) {
  return knex('Account').update({ email }, ['id']).where({ id, exists: true });
}

/**
 * Update a password for an account.
 * @param {string} id - The account ID.
 * @param {string} password - The new password value.
 * @returns {Array} - An empty array if the update was unsuccessful, or an array with a single
 *  object containting the account ID of the row that was updated.
 * @throws Throws an Error if any of the arguments are omitted.
 * @throws Throws an Error if an invalid id string is provided.
 * @throws Throws an Error if password is greater than 64 chars in length.
 * @example
 * updatePassword('1', 'apasswordhash'); // { id: '1' }
 */
function updatePassword(id, password) {
  return knex('Account').update({ password }, ['id']).where({ id, exists: true });
}

/**
 * Create an account.
 * @param {string} username - The username.
 * @param {string} email - The email.
 * @param {string} password - The password.
 * @returns {Array} - An array with a single object containting the (account) ID for the newly
 *  inserted row.
 * @throws Throws an Error if any of the arguments are omitted.
 * @throws Throws an Error if username is greater than 20 chars in length.
 * @throws Throws an Error if email is greater than 30 chars in length.
 * @throws Throws an Error if password is greater than 64 chars in length.
 * @example
 * createAccount('foo', 'bar@email.com', 'mypassword'); // { id: '27' }
 */
function createAccount(username, email, password) {
  return knex('Account')
    .insert({
      username,
      email,
      password,
      exists: true,
    }, ['id']);
}

/**
 * Enable an account.
 * @param {string} id - A digit string that matches the account ID.
 * @returns {Array} - An array with a single object containting the (account) ID if the update
 *  was successful, otherwise an empty array if the account was not found.
 * @throws Throws an Error if the id isn't a string representation of an integer.
 * @throws Throws an Error if id is omitted.
 * @example
 * enableAccount('19'); // { id: '19' }
 */
function enableAccount(id) {
  return knex('Account').update({ exists: true }, ['id']).where({ id });
}

/**
 * Disable an account.
 * @param {string} id - A digit string that matches the account ID.
 * @returns {Array} - An array with a single object containting the (account) ID if the update
 *  was successful, otherwise an empty array if the account was not found.
 * @throws Throws an Error if the id isn't a string representation of an integer.
 * @throws Throws an Error if id is omitted.
 * @example
 * disableAccount('87'); // { id: '87' }
 */
function disableAccount(id) {
  return knex('Account').update({ exists: false }, ['id']).where({ id });
}

module.exports = {
  /**
   * @namespace
   * @borrows createAccount as register
   */
  create: {
    register: createAccount,
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
   * @borrows updatePassword as password
   * @borrows enableAccount as enable
   * @borrows disableAccount as disable
   */
  update: {
    email: updateEmail,
    password: updatePassword,
    enable: enableAccount,
    disable: disableAccount,
  },
};
