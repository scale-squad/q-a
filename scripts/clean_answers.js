const { MongoClient } = require('mongodb');

async function cleanAnswers() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('qa_database');
    const answers = db.collection('answers');


    const cursor = answers.find({
      $or: [
        { photos: { $type: 'string' } },
        { reported: { $type: 'string' } }
      ]
    });

    while (await cursor.hasNext()) {
      const answer = await cursor.next();


      const cleanedReported = answer.reported === 'true';


      const cleanedPhotos = JSON.parse(answer.photos);


      await answers.updateOne(
        { _id: answer._id },
        {
          $set: {
            reported: cleanedReported,
            photos: cleanedPhotos
          }
        }
      );

    }

    console.log('Cleaning complete!');
  } catch (error) {
    console.error('Error cleaning answers:', error);
  } finally {
    await client.close();
  }
}

cleanAnswers();