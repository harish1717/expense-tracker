const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

// Get budget + current spending for a given month
exports.getBudgetStatus = async (req, res) => {
  try {
    const { month } = req.params; // e.g. "2026-09"

    const budget = await Budget.findOne({ user: req.userId, month });

    const start = new Date(`${month}-01T00:00:00.000Z`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const transactions = await Transaction.find({
      user: req.userId,
      type: 'expense',
      date: { $gte: start, $lt: end },
    });

    const spent = transactions.reduce((sum, t) => sum + t.amount, 0);

    res.json({
      month,
      limit: budget?.limit || null,
      spent,
      percentUsed: budget?.limit ? Math.round((spent / budget.limit) * 100) : null,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Set or update the budget for a month
exports.setBudget = async (req, res) => {
  try {
    const { month, limit } = req.body;
    const budget = await Budget.findOneAndUpdate(
      { user: req.userId, month },
      { limit },
      { new: true, upsert: true }
    );
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};