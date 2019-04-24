// TODO: destructure returned arrays that have length one.
const knex = require('./connection');

const tableName = 'Post';

/**
 * Create a new post.
 * @param {string} posterId - The account ID of the poster.
 * @param {string} title - The title of the post.
 * @param {string} body - The body of the post.
 * @returns An object with the ID of the post.
 * @example
 * createNew('283', 'A Post Title', 'The post body.'); // [{ id: '7452849' }]
 */
function createNew(posterId, title, body) {
  return knex(tableName)
    .insert({ title, body, poster_id: posterId }, ['id'])
    .catch(() => Promise.resolve({ error: true })); // TODO: Log error object.
}

/**
 * Update a post.
 * @param {string} id - The post ID to edit.
 * @param {string} title - The new title text.
 * @param {string} body - The new body text.
 * @returns An object with the ID of a post.
 * @example
 * editPost('23647', 'New Title', 'New Body'); // [{ id: '23647' }]
 */
function editPost(id, title = false, body = false) {
  // TODO: allow specific fields to be altered.
  return knex(tableName)
    .update({ id, body, title }, ['id'])
    .where({ id, hidden: false })
    .catch(() => Promise.resolve({ error: true })); // TODO: Log error object.
}

/**
 * Hide a post.
 * @param {string} id - The ID of the post.
 * @returns An object, with the ID of the post that was hidden.
 * @example
 * hide('4729'); // [{ id: '4729' }]
 */
function hide(id) {
  return knex(tableName)
    .update({ hidden: true }, ['id'])
    .where({ id })
    .catch(() => Promise.resolve({ error: true })); // TODO: Log error object.
}

/**
 * Unhide a post.
 * @param {string} id - The ID of the post.
 * @returns An object, with the ID of the post that was hidden.
 * @example
 * unhide('4729'); // [{ id: '4729' }]
 */
function unhide(id) {
  return knex(tableName)
    .update({ hidden: false }, ['id'])
    .where({ id })
    .catch(() => Promise.resolve({ error: true })); // TODO: Log error object.
}

/**
 * Get a visible post by ID.
 * @param {string} id - The post ID.
 * @returns An object with the title, body, date created, and poster ID.
 * @example
 * getById('214');
 * // [{ title: 'Some Title', body: 'Body text.', created_at: 'adate', poster_id: '362'}]
 */
function getById(id) {
  return knex(tableName)
    .select('title', 'body', 'created_at', 'poster_id')
    .where({ id, hidden: false })
    .catch(() => Promise.resolve({ error: true })); // TODO: Log error object.
}

/**
 * Get all posts in a given order.
 * @param {string} order - Should be 'asc' or 'desc'.
 * @returns An array of post objects, ordered by their creation date, where each object has the
 *  fields: 'title', 'body', 'created_at', 'poster_id'. All values are strings, except created_at
 *  is a Date object.
 * @example
 * getAll('desc');
 * // [ { title: 'Tenth Post',
 * //     body: 'Tenth body.',
 * //     created_at: 2019-03-20T13:14:15.000Z,
 * //     poster_id: '6' },
 * //   { title: 'Ninth Post',
 * //     body: 'Ninth body.',
 * //     created_at: 2019-03-19T12:13:14.000Z,
 * //     poster_id: '5' },
 * //   { title: 'Eighth Post',
 * //     body: 'Eighth body.',
 * //     created_at: 2019-03-18T12:13:14.000Z,
 * //     poster_id: '1' },
 * //     ... ,
 * // ]
 */
function getAll(order = 'desc') {
  return knex(tableName)
    .select('title', 'body', 'created_at', 'poster_id')
    .where({ hidden: false })
    .orderBy('created_at', order)
    .catch(() => Promise.resolve({ error: true })); // TODO: Log error object.
}

module.exports = {
  /**
   * @namespace
   * @borrows createNew as new
   */
  create: {
    new: createNew,
  },
  /**
   * @namespace
   * @borrows getAll as getAll
   * @borrows getById as byId
   */
  read: {
    all: getAll,
    byId: getById,
  },
  /**
   * @namespace
   * @borrows editPost as edit
   * @borrows hide as hide
   * @borrows unhide as unhide
   */
  update: {
    edit: editPost,
    hide,
    unhide,
  },
};
