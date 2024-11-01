
const express = require("express");

const router = express.Router();

const { fetch, save, helpful , report } = require('../config/db');





router.put('/:answer_id/helpful', function (req, res) {
  helpful("answers", req.params.answer_id)
  .then((result) => {
    res.status(204).send()
  })
  .catch((error) => {
    console.log('Answer was not marked as helpful', error);
    res.status(500).send('Answer was not marked as helpful');
  })
});


router.put('/:answer_id/report', function (req, res) {
  report("answers", req.params.answer_id)
  .then((result) => {
    res.status(204).send()
  })
  .catch((error) => {
    console.log('Answer was not reported', error);
    res.status(500).send('Answer was not reported');
  })
});


module.exports = router;
