const mongoose = require('mongoose');
const Question = require('../config/db').Question;
const Answer = require('../config/db').Answer;
const Counter = require('../config/db').Counter;

mongoose.connect('mongodb://localhost/qa_database', {});

async function seedCounters() {
  try {
    // Find max `_id` in `questions` collection
    const maxQuestionId = await Question.findOne().sort({ _id: -1 }).select('_id');
    const maxQuestionSeq = maxQuestionId ? maxQuestionId._id : 0;

    // Find max `_id` in `answers` collection
    const maxAnswerId = await Answer.findOne().sort({ _id: -1 }).select('_id');
    const maxAnswerSeq = maxAnswerId ? maxAnswerId._id : 0;

    // Update `counters` for `questions`
    await Counter.findOneAndUpdate(
      { _id: 'questions' },
      { seq_value: maxQuestionSeq },
      { upsert: true }
    );

    // Update `counters` for `answers`
    await Counter.findOneAndUpdate(
      { _id: 'answers' },
      { seq_value: maxAnswerSeq },
      { upsert: true }
    );

    console.log(`Counters seeded successfully:
      questions counter: ${maxQuestionSeq},
      answers counter: ${maxAnswerSeq}`);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding counters:', error);
  }
}

seedCounters();