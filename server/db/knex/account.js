/**
 * CRUD operations for the Account table.
 */
// TODO: unwrap results that contain a single result. Log any results that are > 1.
const knex = require('./connection');
const { normal: log } = require('../../logger');

/**
 * Update an email address for an account.
 * @param {string} id - The account ID.
 * @param {string} email - The new email addess value.
 * @returns {Array} - An empty array if the update was unsuccessful, or an array with a single
 *  object containting the account ID of the row that was updated.
 * @throws Throws an Error if any of the arguments are omitted.
 * @throws Throws an error if the id isn't a digit string (e.g. an integer string) or an integer.
 * @throws Throws an error if the id isn't a number within the range of -9223372036854775808 to
 *  9223372036854775807.
 * @throws Throws an Error if email is greater than 30 chars in length.
 * @example
 * updateEmail('1', 'some@email.com'); // [{ id: '1' }]
 */
function updateEmail(id, email) {
  return knex('Account')
    .update({ email }, ['id'])
    .where({ id, enabled: true })
    .catch(() => Promise.reject(Error())); // TODO: Log error object.
}

/**
 * Update a password for an account.
 * @param {string} id - The account ID.
 * @param {string} password - The new password value.
 * @returns {Array} - An empty array if the update was unsuccessful, or an array with a single
 *  object containting the account ID of the row that was updated.
 * @throws Throws an Error if any of the arguments are omitted.
 * @throws Throws an error if the id isn't a digit string (e.g. an integer string) or an integer.
 * @throws Throws an error if the id isn't a number within the range of -9223372036854775808 to
 *  9223372036854775807.
 * @throws Throws an Error if password is greater than 64 chars in length.
 * @example
 * updatePassword('1', 'apasswordhash'); // [{ id: '1' }]
 */
function updatePassword(id, password) {
  return knex('Account')
    .update({ password }, ['id'])
    .where({ id, enabled: true })
    .catch(() => Promise.reject(Error())); // TODO: Log error object.
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
 * createAccount('foo', 'bar@email.com', 'mypassword'); // [{ id: '27' }]
 */
function createAccount(username, email, password) {
  return knex('Account')
    .insert({ username, email, password, enabled: true }, ['id'])
    .catch((e) => {
      log.error(
        { e,
          params: {
            username,
            email,
            password: `*REDACTED* @ length:${password.length}`,
          },
        },
        'Database:createAccount() failed.',
      );
      return Promise.reject(e);
    }); // TODO: Log error object.
}

/**
 * Enable an account.
 * @param {string} id - A digit string that matches the account ID.
 * @returns {Array} - An array with a single object containting the (account) ID if the update
 *  was successful, otherwise an empty array if the account was not found.
  * @throws Throws an error if the id isn't a digit string (e.g. an integer string) or an integer.
 * @throws Throws an error if the id isn't a number within the range of -9223372036854775808 to
 *  9223372036854775807.
 * @throws Throws an Error if id is omitted.
 * @example
 * enableAccount('19'); // [{ id: '19' }]
 */
function enableAccount(id) {
  return knex('Account')
    .update({ enabled: true }, ['id'])
    .where({ id })
    .catch(() => Promise.reject(Error())); // TODO: Log error object.
}

/**
 * Disable an account.
 * @param {string} id - A digit string that matches the account ID.
 * @returns {Array} - An array with a single object containting the (account) ID if the update
 *  was successful, otherwise an empty array if the account was not found.
 * @throws Throws an error if the id isn't a digit string (e.g. an integer string) or an integer.
 * @throws Throws an error if the id isn't a number within the range of -9223372036854775808 to
 *  9223372036854775807.
 * @throws Throws an Error if id is omitted.
 * @example
 * disableAccount('87'); // [{ id: '87' }]
 */
function disableAccount(id) {
  return knex('Account')
    .update({ enabled: false }, ['id'])
    .where({ id })
    .catch(() => Promise.reject(Error())); // TODO: Log error object.
}

/**
 * Get account ID and email for an enabled account.
 * @param {string} username - The username of the account.
 * @returns {Array} - empty if the username doesn't exist in the database, otherwise it will
 *  contain a single object with the account ID and the email address.
 * @throws Throws an error if username is omitted.
 * @throws Throws an error if the username is greater than 20 chars in length.
 * @example
 * getPrivateInfo('foobar'); // [{ id: '26367', email: 'foobar@email.com' }]
 */
function getPrivateInfo(username) {
  return knex('Account')
    .select('id', 'email')
    .where({ username, enabled: true })
    .catch(() => Promise.reject(Error())); // TODO: Log error object.
}

/**
 * Get the account ID for an enabled account.
 * @param {string} username - The username of the account.
 * @returns {Array} - empty if the username doesn't exist in the database, or the account
 *  is disabled, otherwise it will contain a single object with the account ID.
 * @throws Throws an error if username is omitted.
 * @throws Throws an error if the username is greater than 20 chars in length.
 * @example
 * getPublicInfo('foobar') // [{ id: '3526' }]
 */
function getPublicInfo(username) {
  return knex('Account')
    .select('id')
    .where({ username, enabled: true })
    .catch(() => Promise.reject(Error())); // TODO: Log error object.
}

/**
 * Get the account password for an enabled account.
 * @param {string} username - The username of the account.
 * @returns {Array} - empty if the username doesn't exist in the database, or the account is
 *  disabled, otherwise it will contain a single object with the password.
 * @throws Throws an error if username is omitted.
 * @throws Throws an error if the id isn't a digit string (e.g. an integer string) or an integer.
 * @throws Throws an error if the id isn't a number within the range of -9223372036854775808 to
 *  9223372036854775807.
 * @throws Throws an error if id is omitted.
 * @example
 * getPassword('254'); // [{ password: 'somepasswordhash' }]
 */
function getPassword(id) {
  return knex('Account')
    .select('password')
    .where({ id, enabled: true })
    .catch(() => Promise.reject(Error())); // TODO: Log error object.
}

module.exports = {
  /**
   * @namespace
   * @borrows createAccount as register
   */
  create: {
    register: createAccount,
  },
  /**
   * @namespace
   * @borrows getPrivateInfo as privateInfo
   * @borrows getPublicInfo as publicInfo
   * @borrows getPassword as password
   */
  read: {
    privateInfo: getPrivateInfo,
    publicInfo: getPublicInfo,
    password: getPassword,
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
