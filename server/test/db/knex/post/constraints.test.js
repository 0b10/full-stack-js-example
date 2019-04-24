/* eslint-disable no-undef */
const knex = require('../../../../db/knex/connection');
const db = require('../../../../db');
const data = require('../../../../knex/seeds/data');

const tableName = 'Post';

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

describe('"Create" operations', () => {
  describe('new()', () => {
    // No need to check if all relevant fields are set, this is checked in the simple test.
    it('should create a single record', async () => {
      const result = await db.post.create.new('2', 'A New Test Title', 'A new test post body.');
      expect(result).toHaveLength(1);
    });
    it('should return the correct post ID.', async () => {
      const title = 'iqwqsmjSJH2678hsSUyu276&^7';
      const result = await db.post.create.new('2', title, 'A new test post body.');
      const comparison = await knex(tableName).select('id').where({ title });
      expect(result[0]).toEqual(comparison[0]);
    });
  });
});

describe('"Update" operations', () => {
  describe('edit()', () => {
    it('should only update visible posts', () => Promise.all([
      db.post.update.edit('1', 'A New Test Title', 'A new test post body.'),
      db.post.update.edit('2', 'A New Test Title2', 'A new test post body2.'),
    ])
      .then(([visible, hidden]) => {
        expect(visible[0]).toEqual({ id: '1' });
        expect(hidden).toHaveLength(0);
      }));
    it('should only update the relevant fields', async () => {
      const id = '1';
      const title = 'A New Test Title';
      const body = 'A New Test Body';

      // Do.
      await db.post.update.edit(id, title, body);
      const result = await knex(tableName).where({ id }); // Get.
      result[0].created_at = result[0].created_at.toISOString(); // Date should be a string.
      const seed = data.post[0]; // The original data.

      // Test
      expect(result[0]).toEqual({
        id,
        title,
        body,
        hidden: false,
        created_at: seed.created_at, // Seed date is a string.
        poster_id: seed.poster_id,
      });
    });
  });

  describe('hide()', () => {
    it('should only update a single record.', async () => {
      const result = await db.post.update.hide('1');
      expect(result).toHaveLength(1);
    });
    it('should return the correct id of the post hidden.', async () => {
      const result = await db.post.update.hide('1');
      expect(result[0]).toEqual({ id: '1' });
    });
    it('should only update the "hidden" field - to true.', async () => {
      await db.post.update.hide('1');

      // Do.
      const result = await knex(tableName).where({ id: '1' });
      result[0].created_at = result[0].created_at.toISOString(); // Date should be a string.
      const seed = data.post[0]; // The original data.

      // Test.
      expect(result[0]).toEqual({
        id: '1',
        title: seed.title,
        body: seed.body,
        hidden: true, // The relevant field.
        created_at: seed.created_at, // Seed date is a string.
        poster_id: seed.poster_id,
      });
    });
  });

  describe('unhide()', () => {
    it('should only update a single record.', async () => {
      const result = await db.post.update.unhide('2');
      expect(result).toHaveLength(1);
    });
    it('should return the correct id of the post that\'s been unhidden.', async () => {
      const result = await db.post.update.unhide('2');
      expect(result[0]).toEqual({ id: '2' });
    });
    it('should only update the "hidden" field - to false.', async () => {
      await db.post.update.unhide('2');

      // Do.
      const result = await knex(tableName).where({ id: '2' });
      result[0].created_at = result[0].created_at.toISOString(); // Date should be a string.
      const seed = data.post[1]; // The original data.

      // Test.
      expect(result[0]).toEqual({
        id: '2',
        title: seed.title,
        body: seed.body,
        hidden: false, // The relevant field.
        created_at: seed.created_at, // Seed date is a string.
        poster_id: seed.poster_id,
      });
    });
  });

  describe('"Read" operations', () => {
    describe('byId()', () => {
      it('should return only visible (unhidden) posts.', async () => Promise.all([
        db.post.read.byId('1'),
        db.post.read.byId('2'),
      ])
        .then(([visible, hidden]) => {
          expect(visible).toHaveLength(1);
          expect(hidden).toHaveLength(0);
        }));
    });
    describe('all()', () => {
      it('should return results in descending order by default.', async () => {
        // Do.
        const seeds = data.post
          .filter(row => row.hidden !== true) // hidden posts are not returned by the DB.
          .map(row => ({ // Transform date string to Date objects,
            body: row.body,
            created_at: new Date(row.created_at),
            poster_id: row.poster_id,
            title: row.title,
          }))
          .sort((a, b) => { // Sort by desc.
            if (a.created_at > b.created_at) return -1;
            if (a.created_at < b.created_at) return 1;
            return 0;
          });

        // Get.
        const results = await db.post.read.all(); // created_at, from DB, is a Date object.

        // Test.
        expect(results).toEqual(seeds);
      });
      it('should return results in ascending order when asked.', async () => {
        // Do.
        const seeds = data.post
          .filter(row => row.hidden !== true) // hidden posts are not returned by the DB.
          .map(row => ({ // Transform date string to Date objects,
            body: row.body,
            created_at: new Date(row.created_at),
            poster_id: row.poster_id,
            title: row.title,
          }))
          .sort((a, b) => { // Sort by desc.
            if (a.created_at > b.created_at) return 1;
            if (a.created_at < b.created_at) return -1;
            return 0;
          });

        // Get.
        const results = await db.post.read.all('asc'); // created_at, from DB, is a Date object.

        // Test.
        expect(results).toEqual(seeds);
      });
      it('should only return posts that are not marked as hidden.', async () => {
        const visibleSeeds = data.post.filter(row => row.hidden !== true)
          .map(row => ({ // Transform date string to Date objects,
            body: row.body,
            created_at: new Date(row.created_at),
            poster_id: row.poster_id,
            title: row.title,
          }));
        const result = await db.post.read.all('asc'); // Seeds are in ascending order.
        expect(result).toEqual(visibleSeeds);
      });
    });
  });
});
