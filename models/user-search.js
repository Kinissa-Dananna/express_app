const db = require('../db/config');
const Users = {};


//find users by their name
Users.findByName = (req, res, next) => {
  const { userSearch } = req.params;
  db.manyOrNone(`SELECT name, id  FROM users WHERE LOWER (name) LIKE LOWER ('%${userSearch}%')`)
    .then((response) => {
      //console.log(response)
      res.locals.userName = response[0].name;
      res.locals.userId = response[0].id;
      next();
    })
    .catch(err => {
      console.log('Error getting data from database');
    });
}


module.exports = Users;
