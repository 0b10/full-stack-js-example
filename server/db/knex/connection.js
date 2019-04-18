// IF NODE_ENV type is not set, use the test database.
const environment = process.env.NODE_ENV || 'test';

const knex = require('knex');

// This will contain a "test" section (JSON object), which contains test configuration.
const config = require('../../knexfile');

// This is where you grab the environment specific config from the knex file.
// e.g. "development", "test", "production" etc.
const envConfig = config[environment];

// Make the actual DB connection. This runs only once due to Node's module caching.
const connection = knex(envConfig); // The connection is pooled by default.

if (connection) console.log(
  `* Database connection made with NODE_ENV: ${environment} \
  to database ${envConfig.connection.database}.`
); // Practice project, just for debugging.

// Export the connection.
// Node's module caching means that it is the same instance that is exported when it's used in
// multiple modules.
module.exports = connection;
