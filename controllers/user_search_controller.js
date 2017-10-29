const router = require('express').Router();
const User = require('../models/user-search');
const Auth = require('../services/auth');


router.get('/:userSearch',
  Auth.restrict,
  User.findByName,
  (req, res) => {
    const userName = res.locals.userName;
    const userId = res.locals.userId;
    res.json({ userName: userName, userId: userId });
  });


module.exports = router;
