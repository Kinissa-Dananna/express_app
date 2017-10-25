const router = require('express’).Router();
const Events = require('../models/events');

// get controller homepage
router.get('/',
 Events.findAll,
 (req, res) => {
    res.render(_*view*_', res.locals.data);
});

// get obj by id
router.get(‘/:id',
 Events.findById, 
(req, res) => {
    res.render(_*view*_', {
            _*DataObj*_: res.locals._*Data*_
      });
});

//--------------------------------------------------------------
//--------------------------- API ROUTES ---------------------
//--------------------------------------------------------------

// post newrouter.post('/new',
  Events.create,
  (req, res) => {
    res.render('show', res.locals.newData)
  });

// update router.put('/:id',
    Events.update,
    (req, res) => {
      res.render('show', res.locals.editedData)
    });

// deleterouter.delete('/:id',
  Events.destroy,
  (req, res) => {
    res.render('index')
  });

module.exports = router;
