/**
 * Get all the necessary data for a database seed
 */
// Easily create datetime strings.
const moment = require('moment');

/**
 * Create a UTC datetime string.
 * @param {string} dtString - A datetime string in the form: DD:MM:YY HH:MM:ss. No param means
 *  The current datetime is returned.
 * @example
 *  datetime('23-01-2015 12:31:16');
 *  datetime(); // Current datetime.
 */
function datetime(dtString) {
  if (!dtString) return moment().utc().toISOString();
  return moment(dtString, 'DD-MM-YYYY HH:mm:ss').utc().toISOString(); // Must be strings, not obj.
}

// This is the meat of the module. Each top level key corresponds to a table name.
// data.account will return an array of objects, ready to be inserted by knex like so:
//   knex('table_name').insert(data.account);
module.exports = {
  account: [
    // Password hashes are just the username hashed with sha256.
    // Post has a foreign key constraint for id. The id must exist while that post exists,
    //  otherwise knex will throw an error.
    {
      username: 'user1',
      email: 'user1@email.com',
      password: 'ca7ff1090441a69d97677bb0bab331617429a362a2835a29eb5f3f47600a10f0',
      enabled: true, // Explicit, because tests depend on this being true.
    }, {
      username: 'user2',
      email: 'user2@email.com',
      password: '530044660947a58cbf6036c0aa2922d9882734e51f7ec22a2640ee9f542ebc82',
      enabled: false, // A number of tests require that this is set to false.
    }, {
      username: 'user3',
      email: 'user3@email.com',
      password: 'b4e8183bc3773e785982918eefcab56eb390b2582a06812739d97d944830293f',
    }, {
      username: 'user4',
      email: 'user4@email.com',
      password: 'a8d372305113b3e05aee426958f363b2a2d32bd57501b6e295e633cca34ec154',
    }, {
      username: 'user5',
      email: 'user5@email.com',
      password: '9fb257c2d1281f518d8ccb6f3eeb30b1d92bcf66ddb413db2d8f0dafaa47659f',
    }, {
      username: 'user6',
      email: 'user6@email.com',
      password: 'ffacbbb7af9c95a652b97a8775917d63fe5ff2775ce5676b8c7317a68a53b2ce',
      enabled: false,
    },
  ],
  post: [
    // poster_id is foreign key pointing to Account.id. Non-existing uids will throw an error -
    //   Be careful of this when manipulating Account.
    // Every user id has at least one post here.
    // NOTE: Objects MUST be inserted, in ascending order, relative to their created_at field.
    {
      title: 'First Post',
      body: 'First body.',
      created_at: datetime('16-03-2017 10:13:13'),
      poster_id: '1',
    }, {
      title: 'Second Post',
      body: 'Second body.',
      created_at: datetime('16-03-2017 10:13:14'),
      poster_id: '2',
      hidden: true, // The post.update.unhide() test depends on this being true.
    }, {
      title: 'Third Post',
      body: 'Third body.',
      created_at: datetime('16-03-2017 11:13:14'),
      poster_id: '1',
    }, {
      title: 'Fourth Post',
      body: 'Fourth body.',
      created_at: datetime('16-03-2017 12:13:14'),
      poster_id: '2',
    }, {
      title: 'Fifth Post',
      body: 'Fifth body.',
      created_at: datetime('19-03-2017 12:13:14'),
      poster_id: '3',
    }, {
      title: 'Sixth Post',
      body: 'Sixth body.',
      created_at: datetime('19-03-2018 12:13:14'),
      poster_id: '3',
    }, {
      title: 'Seventh Post',
      body: 'Seventh body.',
      created_at: datetime('17-03-2019 11:12:14'),
      poster_id: '4',
    }, {
      title: 'Eighth Post',
      body: 'Eighth body.',
      created_at: datetime('18-03-2019 12:13:14'),
      poster_id: '1',
    }, {
      title: 'Ninth Post',
      body: 'Ninth body.',
      created_at: datetime('19-03-2019 12:13:14'),
      poster_id: '5',
    }, {
      title: 'Tenth Post',
      body: 'Tenth body.',
      created_at: datetime('20-03-2019 13:14:15'),
      poster_id: '6',
    },
  ],
};
