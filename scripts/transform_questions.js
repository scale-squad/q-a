const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { Parser } = require('json2csv');

const questions = [];


const inputFilePath = path.resolve(__dirname, '../data/questions.csv');
const outputFilePath = path.resolve(__dirname, '../data/transformed_questions.csv');

fs.createReadStream(inputFilePath)
  .pipe(csv())
  .on('data', (row) => {
    console.log(row);
    const transformedRow = {
      _id: parseInt(row.id),
      product_id: row.product_id.toString(),
      question_body: row.body,
      question_date: new Date(parseInt(row.date_written)).toISOString(),
      asker_name: row.asker_name,
      asker_email: row.asker_email,
      question_helpfulness: parseInt(row.helpful),
      reported: row.reported === '1' ? true : false,
    };
    questions.push(transformedRow);
  })
  .on('end', () => {
    const json2csvParser = new Parser();
    const csvData = json2csvParser.parse(questions);
    fs.writeFileSync(outputFilePath, csvData);

  });