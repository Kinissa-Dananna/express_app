const router = require('express').Router();
const User = require('../models/user-search');
const Auth = require('../services/auth');


router.get('/:userSearch',
  Auth.restrict,
  User.findByName,
  (req, res) => {
<<<<<<< HEAD
    const userName = res.locals.userName;
    const userId = res.locals.userId;
    res.json({ userName: userName, userId: userId });
=======
	    res.json(res.locals.users);
>>>>>>> 1fbc74a54c64d876d90f7b7efd15683bfb2a5519
  });


module.exports = router;
