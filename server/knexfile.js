/*
  Connection info should be set in ~/.pgpass - which includes: host, port, db, user, password etc.
*/
module.exports = {

  development: {
    client: 'pg',
    connection: {
      database: 'dev_full_stack_js_example',
    },
  },
  test: {
    client: 'pg',
    connection: {
      database: 'test_full_stack_js_example',
    },
  },

};
