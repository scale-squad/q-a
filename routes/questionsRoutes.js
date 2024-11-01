
const express = require("express");

const router = express.Router();

const { fetch, save, helpful , report, getNextId } = require('../config/db');


router.get('/', async function (req, res) {
  try {
    const questions = await fetch("questions", req.query.product_id, req.query.page || 1, req.query.count || 5);
    res.status(200).send(questions);
  } catch (error) {
    console.log('Can not get questions from DB', error);
    res.status(500).send('Can not get questions from DB');
  }
});


router.post('/', async function (req, res) {
  const body = req.body.body;
  const name = req.body.name;
  const email = req.body.email;
  const product_id = req.body.product_id;


  if (!body || !name || !email || !product_id) {
    return res.status(400).send("All fields are required");
  }

  try {

    await save("questions", body, name, email, product_id);
    res.status(201).send("CREATED");
  } catch (error) {
    console.log('Question is not saved in db', error);
    res.status(500).send('Question is not saved in db');
  }
});


router.put('/:question_id/helpful', async function (req, res) {
  try {
    await helpful("questions", req.params.question_id);
    res.status(204).send();
  } catch (error) {
    console.log('Question was not marked as helpful', error);
    res.status(500).send('Question was not marked as helpful');
  }
});


router.put('/:question_id/report',  async function (req, res) {
  try {
    await report("questions", req.params.question_id);
    res.status(204).send();
  } catch (error) {
    console.log('Question was not reported', error);
    res.status(500).send('Question was not reported');
  }
});

router.get('/:question_id/answers', async function (req, res) {
  const question_id = req.params.question_id;
  const page = req.query.page || 1;
  const count = req.query.count || 5;

  try {
    const answers = await fetch("answers", question_id, page, count);
    res.status(200).send(answers);
  } catch (error) {
    console.log('Can not get answers from DB', error);
    res.status(500).send('Can not get answers from DB');
  }
});


router.post('/:question_id/answers', async function (req, res) {
  const body = req.body.body;
  const name = req.body.name;
  const email = req.body.email;
  const photos = req.body.photos || [];
  const question_id = req.params.question_id;

  if (!body || !name || !email || !question_id) {
    return res.status(400).send("All fields are required");
  }

  try {
    await save("answers", body, name, email, question_id, photos);
    res.status(201).send("CREATED");
  } catch (error) {
    console.log('Answer is not saved in db', error);
    res.status(500).send('Answer is not saved in db');
  }
});



module.exports = router;
