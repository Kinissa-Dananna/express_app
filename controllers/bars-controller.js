const router = require('express').Router();
const Bars = require('../models/bars');
const Auth = require('../services/auth');

// get controller homepage
router.get('/:eventId',
Auth.restrict,
 Bars.findAllByEventId,
 Bars.findAllBarData,
 (req, res) => {
    //  const { bars } = res.locals;
    //  res.json({ bars: bars });
    const { arrayResults } = res.locals;
    res.json(arrayResults);
});

//get obj by id
router.get('/:eventId/:id',
Auth.restrict,
 Bars.findOneBarById,
 Bars.findOneBarData,
 (req, res) => {
   const { arrayResults } = res.locals;
   res.json(arrayResults);
});


//--------------------------------------------------------------
//--------------------------- API ROUTES ---------------------
//--------------------------------------------------------------

//post new
router.post('/:eventId/new',
Auth.restrict,
  Bars.create,
(req, res) => {
        const { arrayResults } = res.locals;
        res.json(arrayResults);
    });


// delete
router.delete('/:eventId/:id',
Auth.restrict,
  Bars.destroy,
(req, res) => {
      res.send('Deleted from DB.');
    });

module.exports = router;
