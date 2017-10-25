const pgp = require('pg-promise')({}),
<<<<<<< HEAD
config = process.env.DATABASE_URL || 'postgres://Drisdon@localhost:5432/bar_crawl_db',
=======
config = process.env.DATABASE_URL || 'postgres://annarpack@localhost:5432/bar_crawl_db',
>>>>>>> 14615e69b0b8dfa7ad1cf91ebec4759245ef2f05
db = pgp(config);

module.exports = db;
