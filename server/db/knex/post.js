const knex = require('./connection');

const tableName = 'Post';

module.exports = {
  create: {
    new: (posterId, title, body) => knex(tableName).insert({ title, body, poster_id: posterId }),
  },
  read: {
    all: (order = 'desc') => knex(tableName)
      .select('title', 'body', 'created_at', 'poster_id')
      .orderBy('created_at', order),
    byId: id => knex(tableName).select('title', 'body', 'created_at', 'poster_id').where({ id }),
  },
  update: {
    edit: (id, title, body) => knex(tableName).update({ id, body, title }).where({ id }),
    hide: id => knex(tableName).update({ hidden: true }).where({ id }),
    unhide: id => knex(tableName).update({ hidden: false }).where({ id }),
  },
};
