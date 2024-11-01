const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/qa_database', {});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connection succesful!")
});


let questionsSchema = mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  product_id: {
    type: Number,
    required: true,
  },
  question_body: String,
  question_date: String,
  asker_name: String,
  asker_email: String,
  question_helpfulness: Number,
  reported: Boolean,
  answers: { type: Map, of: Object }
}, { _id: false });


let Question = mongoose.model('Question', questionsSchema);

let answersSchema = mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  question_id: {
    type: Number,
    required: true,
  },
  answer_body: String,
  answer_date: String,
  answerer_name: String,
  answerer_email: String,
  answer_helpfulness: Number,
  reported: Boolean,
  photos: Array
}, { _id: false });

let Answer = mongoose.model('Answer', answersSchema);



let fetch = (collection, id, page, count) => {
  const skip = (page - 1) * count;
  console.log('count in fetch:', count);
  if (collection === "questions") {

    return Question.aggregate([
      {
        $match: { product_id: Number(id), reported: false }
      },
      {
        $lookup: {
          from: 'answers',
          localField: '_id',
          foreignField: 'question_id',
          as: 'answers'
        }
      },
      // format answers array
      {
        $addFields: {
          answers: {
            $arrayToObject: {
              $map: {
                input: "$answers",
                as: "answer",
                in: {
                  k: { $toString: "$$answer._id" },
                  v: {
                    id: "$$answer._id",
                    body: "$$answer.answer_body",
                    date: "$$answer.answer_date",
                    answerer_name: "$$answer.answerer_name",
                    helpfulness: "$$answer.answer_helpfulness",
                    photos: "$$answer.photos"
                  }
                }
              }
            }
          }
        }
      }
    ])
    .skip(Number(skip))
    .limit(Number(count))
    .exec();

    // return Question.find({ product_id: id, reported: false })
    // .skip(skip)
    // .limit(count)
    // .exec();


  } else {
  return Answer.find({ reported: false, question_id: id})
    .limit(count)
    .skip(skip)
    .exec();
  }
}


let save = (collection, body, name, email, id, photos) => {
  if (collection === "questions") {
    let newQuestion = new Question({
      product_id: id,
      question_body: body,
  question_date: new Date().toISOString(),
  asker_name: name,
  asker_email: email,
  question_helpfulness: 0,
  reported: false,
    });
    return newQuestion.save()
    .then(() => {
      console.log('Question saved');
    }).catch(err => {
      console.error('Error saving a word ', err);
    });
   } else {
    let newAnswer = new Answer({
      question_id: id,
      answer_body: body,
  answer_date: new Date().toISOString(),
  answerer_name: name,
  answerer_email: email,
  answer_helpfulness: 0,
  reported: false,
  photos: photos
    });
    return newAnswer.save()
    .then(() => {
      console.log('Answer saved');
    }).catch(err => {
      console.error('Error saving a word ', err);
    });
   }
}

let helpful = (collection, id) => {
  if (collection === "questions") {
    return Question.findOneAndUpdate (
      {_id: id},
      {$inc: { question_helpfulness: 1 } },
      {new: true}
    ).exec()
    .then(() => {
      console.log(`Question has been updated`)
    }).catch(err => console.log('Error updating the question', err));
  } else {
    return Answer.findOneAndUpdate (
      {_id: id},
      {$inc: { answer_helpfulness: 1 }},
      {new: true}
    ).exec()
    .then(() => {
      console.log(`Answer has been updated`)
    }).catch(err => console.log('Error updating the answer', err));
  }
}


let report = (collection, id) => {
  if (collection === "questions") {
    return Question.findOneAndUpdate (
      {_id: id},
      {reported: true},
      {new: true}
    ).exec()
    .then(() => {
      console.log(`Question has been reported`)
    }).catch(err => console.log('Error reporting the question', err));
  } else {
    return Answer.findOneAndUpdate (
      {_id: id},
      {reported: true},
      {new: true}
    ).exec()
    .then(() => {
      console.log(`Answer has been reported`)
    }).catch(err => console.log('Error reporting the answer', err));
  }
}



module.exports = { Answer, Question, fetch, save, helpful, report };



