const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  categories: {
    type: [String],
    default: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Salary', 'Other'],
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);