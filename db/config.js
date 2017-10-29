const pgp = require('pg-promise')({}),

  config = process.env.DATABASE_URL || 'postgres://kinllim@localhost:5432/bar_crawl_db',
  db = pgp(config);

module.exports = db;
