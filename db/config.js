const pgp = require('pg-promise')({}),
config = process.env.DATABASE_URL || 'postgres://larissa.catalano@localhost:5432/exp_token_auth',
db = pgp(config);

module.exports = db;
