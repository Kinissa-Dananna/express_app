const router = require('express').Router();
const Bars = require('../models/bars');

// get controller homepage
router.get('/:eventId',
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
  Bars.create,
(req, res) => {
        const { arrayResults } = res.locals;
        res.json(arrayResults);
    });


// delete
router.delete('/:eventId/:id',
  Bars.destroy,
(req, res) => {
      res.send('Deleted from DB.');
    });

module.exports = router;
