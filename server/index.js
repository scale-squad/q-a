require("dotenv").config();
const questionsRoutes = require('../routes/questionsRoutes');
const answersRoutes = require('../routes/answersRoutes');

const express = require("express");
const path = require("path");
const app = express();



require('../config/db');

app.use(express.json());

app.use('/qa/questions', questionsRoutes);
app.use('/qa/answers', answersRoutes);


if (process.env.NODE_ENV !== 'test') {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Listening at http://localhost:${process.env.PORT || 3000}`);
  });
}

module.exports = app;