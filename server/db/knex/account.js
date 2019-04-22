const knex = require('./connection');

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
  update: {
    email: (id, email) => knex('Account').update({ email }).where({ id }),
    password: (id, password) => knex('Account').update({ password }).where({ id }),
    existence: (id, exists) => knex('Account').update({ exists }).where({ id }),
  },
};
