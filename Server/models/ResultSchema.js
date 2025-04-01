// models/Results.js
const mongoose = require('mongoose');

const resultsSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  topic: { type: String, required: true },
  difficulty: { type: String, required: true },
  timeTaken: { type: Number, required: true }, // in seconds
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  email: { type: String, required: true },
  accuracy: { type: Number, default: 0 }, // in percentage
}, { timestamps: true });

resultsSchema.pre('save', function (next) {
  if (this.totalQuestions > 0) {
    this.accuracy = ((this.score / this.totalQuestions) * 100).toFixed(2); // Round to 2 decimal places
  } else {
    this.accuracy = 0;
  }
  next();
});

module.exports = mongoose.model('Results', resultsSchema);