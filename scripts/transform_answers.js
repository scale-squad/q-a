const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { Parser } = require('json2csv');

const photosByAnswer = {};

const photosFilePath = path.resolve(__dirname, '../data/answers_photos.csv');
const inputFilePath = path.resolve(__dirname, '../data/answers.csv');
const outputFilePath = path.resolve(__dirname, '../data/transformed_answers.csv');

const fields = [
  '_id',
  'question_id',
  'answer_body',
  'answer_date',
  'answerer_name',
  'answerer_email',
  'answer_helpfulness',
  'reported',
  'photos',
];

const json2csv = new Parser({ fields });


fs.createReadStream(photosFilePath)
  .pipe(csv())
  .on('data', (row) => {
    const answerId = row.answer_id;
    if (!photosByAnswer[answerId]) photosByAnswer[answerId] = [];
    photosByAnswer[answerId].push({ id: parseInt(row.id), url: row.url });
  })
  .on('end', () => {
    console.log('Photos loaded. Now answers');

    const inputStream = fs.createReadStream(inputFilePath).pipe(csv());
    const outputStream = fs.createWriteStream(outputFilePath);


    outputStream.write(json2csv.parse([]).split('\n')[0] + '\n');

    inputStream
      .on('data', (row) => {
        const transformedRow = {
          _id: parseInt(row.id),
          question_id: row.question_id.toString(),
          answer_body: row.body,
          answer_date: new Date(parseInt(row.date_written)).toISOString(),
          answerer_name: row.answerer_name,
          answerer_email: row.answerer_email,
          answer_helpfulness: parseInt(row.helpful),
          reported: row.reported === '1' ? true : false,
          photos: photosByAnswer[row.id] || [],
        };

        try {
          const csvRow = json2csv.parse([transformedRow]).split('\n')[1];
          outputStream.write(csvRow + '\n');
        } catch (err) {
          console.error('Error converting row to CSV:', err);
        }
      })
      .on('end', () => {
        console.log('Transformation complete!!! Wohoo');
        outputStream.end();
      })
      .on('error', (err) => console.error('Error processing answers:', err));
  })
  .on('error', (err) => console.error('Error loading photos:', err));