# q-a
database for q&amp;a API calls (by Eve)
<<<<<<< HEAD


----- 1. To seed:

mongoimport --db qa_database --collection questions --type csv --file ./data/transformed_questions.csv --headerline

mongoimport --db qa_database --collection answers --type csv --file ./data/transformed_answers.csv --headerline

----- 2.after seeding the question collection with transformed_questions.csv, run this command inside mongosh to convert reported to Boolean for questions:

db.questions.updateMany(
  { reported: "false" },
  { $set: { reported: false } }
);

db.questions.updateMany(
  { reported: "true" },
  { $set: { reported: true } }
);

----- 3. To clean up answers, run this script:

node scripts/clean_answers.js


----- 4. Run this command to confirm the sample of data looks correct:

db.questions.find().limit(5).pretty()
db.answers.find().limit(5).pretty()



----- 5. additional steps to help verify the data in correct format:

Run this command to verify that there are true and false fields:
db.questions.find({ reported: true }).limit(5).pretty();
db.questions.find({ reported: false }).limit(5).pretty();


This commands to verify total numbers of trues and falses:
db.questions.countDocuments({ reported: true });
db.questions.countDocuments({ reported: false });

db.answers.countDocuments({ reported: true });
db.answers.countDocuments({ reported: false });


----- 6. Seed counters collection with exisiting IDs from collections:

node scripts/seed_counters.js



