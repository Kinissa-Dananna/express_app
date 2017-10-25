const router = require('express').Router();
const Bars = require('../models/bars');

// get controller homepage
router.get('/:eventId',
 Bars.findAllByEventId,
 (req, res) => {
     const { bars } = res.locals;
     res.json({ bars: bars });
});

//get obj by id
router.get('/:eventId/:id',
 Bars.findOneBarById,
 Bars.findOneBarData,
 (req, res) => {
   const { bar } = res.locals;
   const barData = res.locals.barData;
   res.json({
     barData: barData
    });
});


//--------------------------------------------------------------
//--------------------------- API ROUTES ---------------------
//--------------------------------------------------------------

// post new
// router.post('/new',
//   Bars.create,
// (req, res) => {
//         const { arrayResults } = res.locals;
//         res.json(arrayResults);
//     });
//
//
// // update
//  router.put('/:id',
//     Bars.update,
// (req, res) => {
//         const { arrayResults } = res.locals;
//         res.json(arrayResults);
//     });
//
// // delete
// router.delete('/:id',
//   Bars.destroy,
// (req, res) => {
//         const { arrayResults } = res.locals;
//         res.json(arrayResults);
//     });

module.exports = router;
