const db = require('../db/config');
const Users = {};


//find users by their name
Users.findByName = (req, res, next) => {
  const { userSearch } = req.params;
  db.manyOrNone( `SELECT name  FROM users WHERE LOWER (name) LIKE LOWER ('%${userSearch}%')` )
  .then((name) => {
    res.locals.userName = name;
    next();
  })
  .catch(err => {
    console.log('Error getting data from database');
  });
}


module.exports = Users;
