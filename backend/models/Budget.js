const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: String, required: true }, // format: "2026-09"
  limit: { type: Number, required: true },
}, { timestamps: true });

budgetSchema.index({ user: 1, month: 1 }, { unique: true }); // one budget per user per month

module.exports = mongoose.model('Budget', budgetSchema);