/* eslint-disable no-undef */
const knex = require('../../../../db/knex/connection');
const db = require('../../../../db');
const data = require('../../../../knex/seeds/data');

// beforeEach, afterEach is called once between tests.
beforeEach(async () => {
  // Setup/teardown in jest can handle retuned promises, or use done() for async calls.
  await knex.migrate.rollback();
  await knex.migrate.latest();
  return knex.seed.run(); // Return the promise.
});

// knex.destroy() expects a callback, or to be chained as a promise.
// beforreAll, and afterAll are called once per module.
afterAll(() => knex.destroy(() => console.log('DB pooling connection destroyed.')));

describe('The database "Post" table', () => {
  describe('"Create" operations', () => {
    it('new(): should add post, uid, title, body to db, with an auto-timestamp.', async () => {
      const title = 'wqeiu6rak%sj£djr3y4s*5hdkjdfjuyo'; // Sufficiently random to avoid collisions.
      const body = 'dwqyeuyroeialsqiwueuasbdvfwqytf';

      await db.post.create.new('1', title, body); // (poster_id, title, body)
      const result = await knex('Post')
        .select('title', 'body', 'created_at', 'poster_id')
        .where({ title });

      // Check the retutrned result minus the timestamp (it needs a pattern).
      expect(result[0]).toMatchObject({ title, body, poster_id: '1' }); // Allows partial matches,
      // Check timestamp separately.
      expect(result[0].created_at.toString()).toMatch(/.+/); // Any string len > 0.
    });
  });

  describe('"Read" operations', () => {
    it('all(): Should return all posts with title, body, created_at, poster_id.', async () => {
      const result = await db.post.read.all('asc');

      // The resuling objects contain a Date object that's compared against a string - not good.
      const transform = result
        .map(row => ({
          title: row.title,
          body: row.body,
          created_at: row.created_at.toISOString(), // Make ISO datetime string.
          poster_id: row.poster_id,
        }));

      // The seed data contains other columns, must exclude those to match against result.
      const expected = data.post
        .filter(row => row.hidden !== true) // hidden posts are not returned by the DB.
        .map(row => ({
          title: row.title,
          body: row.body,
          created_at: row.created_at,
          poster_id: row.poster_id,
        }));

      expect(transform).toMatchObject(expected);
    });
    it('byId(): Should return title, body, created_at, poster_id for given post ID.', async () => {
      const result = await db.post.read.byId('1'); // First post.
      expect(result).toHaveLength(1); // Expect a single result.
      const [transform] = result.map(row => ({ // Tansform only the Date object: created_at.
        title: row.title,
        body: row.body,
        created_at: row.created_at.toISOString(), // Results return Date object - data is string.
        poster_id: row.poster_id,
      }));
      expect(transform).toEqual(data.post[0]); // data.post[0] == First inserted post.
    });
  });

  describe('"Update" operations', () => {
    it('edit(): should update the title, body for row with the given ID.', async () => {
      const id = '1';
      const { title, body, poster_id } = data.post[0]; // eslint-disable-line camelcase

      // Check the record first. Ignoring the timestamp.
      let result = await knex('Post').select('title', 'body', 'poster_id').where({ id });
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({ title, body, poster_id });

      // New values.
      const newTitle = 'mhs5jd92Jd8364hD£87hj&27hjawdf'; // Must have entropy for uniqueness.
      const newBody = 'Susdjksafb*&%%$sjhdn28lS67jkEi';

      // Update.
      await db.post.update.edit(id, newTitle, newBody);
      result = await knex('Post').select('id', 'title', 'body').where({ title: newTitle });

      // Check.
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ id, title: newTitle, body: newBody });
    });
    it('hide(): Should set "hidden" to true.', async () => {
      const id = '1';
      const prior = await knex('Post').select('hidden').where({ id });

      // Ensure prior result == false
      expect(prior).toHaveLength(1);
      expect(prior[0]).toEqual({ hidden: false });

      // Update.
      await db.post.update.hide(id);
      const after = await knex('Post').select('hidden').where({ id });

      // Check now == true.
      expect(after).toHaveLength(1);
      expect(after[0]).toEqual({ hidden: true });
    });
    it('unhide(): Should set "hidden" to false.', async () => {
      const id = '2'; // This record is hidden by default.
      const prior = await knex('Post').select('hidden').where({ id });

      // Ensure prior result == true
      expect(prior).toHaveLength(1);
      expect(prior[0]).toEqual({ hidden: true });

      // Update.
      await db.post.update.unhide(id);
      const after = await knex('Post').select('hidden').where({ id });

      // Check now == false.
      expect(after).toHaveLength(1);
      expect(after[0]).toEqual({ hidden: false });
    });
  });
});
