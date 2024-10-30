# q-a
database for q&amp;a API calls (by Eve)
<<<<<<< HEAD


after seeding the question collection with transformed_questions.csv, run these commands inside mongosh to fix some data formats:




Convert reported to Boolean for questions:
db.questions.updateMany(
  {},
  [
    {
      $set: {
        reported: {
          $cond: {
            if: { $eq: ["$reported", "true"] },
            then: true,
            else: false
          }
        }
      }
    }
  ]
);

Convert reported to Boolean for answers:
db.answers.updateMany(
  {},
  [
    {
      $set: {
        reported: {
          $cond: {
            if: { $eq: ["$reported", "true"] },
            then: true,
            else: false
          }
        }
      }
    }
  ]
);

Convert question_id to String:


Run this command to verify that there are true and false fields:
db.questions.find({ reported: true }).limit(5).pretty();
db.questions.find({ reported: false }).limit(5).pretty();


This commands to verify total numbers of trues and falses:
db.questions.countDocuments({ reported: true });
db.questions.countDocuments({ reported: false });

db.answers.countDocuments({ reported: true });
db.answers.countDocuments({ reported: false });

Run this command to confirm the sample of data looks correct:
db.questions.find().limit(5).pretty()
db.answers.find().limit(5).pretty()

To seed the answers collection:
mongoimport --db qa_database --collection answers --type csv --file ./data/cleaned_answers.csv --headerline


/////////
Embedding answers into questions collection later if needed:
db.questions.aggregate([
  {
    $lookup: {
      from: "answers",
      localField: "_id",
      foreignField: "question_id",
      as: "answersArray"
    }
  },
  {
    $addFields: {
      answers: {
        $arrayToObject: {
          $map: {
            input: "$answersArray",
            as: "answer",
            in: [
              "$$answer._id",
              {
                id: "$$answer._id",
                body: "$$answer.body",
                date: "$$answer.date",
                answerer_name: "$$answer.answerer_name",
                helpfulness: "$$answer.helpfulness",
                photos: "$$answer.photos"
              }
            ]
          }
        }
      }
    }
  },
  { $out: "questions" }
]);
=======
>>>>>>> a0b89785134e6f9278d562e0fbf68a9fe9b4ef92
