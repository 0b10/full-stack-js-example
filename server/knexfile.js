/*
  Connection info should be set in ~/.pgpass - which includes: host, port, db, user, password etc.
  This module will load that file, and include it in the config object.
  If you need to add a database, add it to the pgpass file, module.exports, and create an
  approproate alias - nothing else should need to be done.
*/
if (!process.env.PGPASSFILE) throw Error('The PGPASSFILE env variable needs to be set.');

// Get each valid line from the pgpass file, as an array.
const pgpass = require('fs')
  .readFileSync(process.env.PGPASSFILE, 'utf8') // The file path = PGPASSFILE.
  .split('\n') // It's a single string.
  .filter(line => /^([\w]+:){4}[\w]+$/.test(line)); // Filter valid lines.

if (pgpass.length <= 0) throw Error('There is no valid connection info in the pgpass file.');

const { normal: log } = require('./logger');


// Holds the credentials from each valid line. Each top-level key is a database name.
const credentials = {};

pgpass.forEach((line) => {
  const segment = line.split(':'); // Split line into segments.
  const dbname = segment[2];
  credentials[dbname] = { // Db name as key.
    host: segment[0], // The nested keys represent the connection data.
    port: segment[1],
    name: dbname,
    user: segment[3],
    password: segment[4],
  };
});

// Because this is a beginner's project, and debugging is useful.
// TODO: Use logger.
console.log('* Database credentials:\n', credentials);

// Alias database names.
// CHANGE ME when adding a new database. Alias its name here. Not necessary, but looks nicer.
// The credentials key is 1:1 with the db name.
const devdb = credentials.dev_full_stack_js_example;
const testdb = credentials.test_full_stack_js_example;

// Override the knex logging methods.
const logConfig = {
  warn: (message) => {
    log.warn({ knex: message }, 'Knex: warning ');
  },
  error: (message) => {
    log.error({ knex: message }, 'Knex: error');
  },
  deprecate: (message) => {
    log.warn({ knex: message }, 'Knex: DEPRECATED');
  },
  debug: (message) => {
    log.debug({ knex: message }, 'Knex: debug');
  },
};

// Reuse this config for NODE_ENV=test|debug
const testConfig = {
  client: 'pg',
  connection: {
    host: testdb.host,
    port: testdb.port,
    user: testdb.user,
    password: testdb.password,
    database: testdb.name,
  },
  migrations: {
    directory: './knex/migrations',
  },
  seeds: {
    directory: './knex/seeds/db/test',
  },
  log: logConfig,
  debug: true,
};

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: devdb.host,
      port: devdb.port,
      user: devdb.user,
      password: devdb.password,
      database: devdb.name,
    },
    migrations: {
      directory: './knex/migrations',
    },
  },
  test: testConfig,
  debug: testConfig,
};
