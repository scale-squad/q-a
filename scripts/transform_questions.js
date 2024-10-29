const fs = require('fs');
const csv = require('csv-parser');
const { Parser } = require('json2csv'); // For writing back to CSV

const questions = [];

fs.createReadStream('questions.csv')
  .pipe(csv())
  .on('data', (row) => {
    const transformedRow = {
      _id: parseInt(row.id), // Keep 'id' as MongoDB _id
      product_id: row.product_id.toString(), // Convert to string
      question_body: row.body,
      question_date: new Date(parseInt(row.date_written)).toISOString(), // Convert timestamp to ISO date
      asker_name: row.asker_name,
      asker_email: row.asker_email,
      question_helpfulness: parseInt(row.helpful),
      reported: row.reported === '1' ? true : false, // Convert to boolean
    };
    questions.push(transformedRow);
  })
  .on('end', () => {
    console.log('Transformation complete. Writing to new CSV...');

    const json2csvParser = new Parser();
    const csvData = json2csvParser.parse(questions);

    fs.writeFileSync('transformed_questions.csv', csvData);
    console.log('New CSV file created: transformed_questions.csv');
  });