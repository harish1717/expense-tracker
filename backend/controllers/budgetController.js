const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

// Get all budgets + spending for a given month, one entry per category
exports.getBudgetStatus = async (req, res) => {
  try {
    const { month } = req.params;

    const budgets = await Budget.find({ user: req.userId, month });

    const start = new Date(`${month}-01T00:00:00.000Z`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const transactions = await Transaction.find({
      user: req.userId,
      type: 'expense',
      date: { $gte: start, $lt: end },
    });

    const result = budgets.map((b) => {
      const spent = transactions
        .filter((t) => t.category === b.category)
        .reduce((sum, t) => sum + t.amount, 0);
      return {
        _id: b._id,
        category: b.category,
        limit: b.limit,
        spent,
        percentUsed: Math.round((spent / b.limit) * 100),
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Set or update a budget for a specific category + month
exports.setBudget = async (req, res) => {
  try {
    const { month, category, limit } = req.body;
    const budget = await Budget.findOneAndUpdate(
      { user: req.userId, month, category },
      { limit },
      { new: true, upsert: true }
    );
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a category budget
exports.deleteBudget = async (req, res) => {
  try {
    await Budget.findOneAndDelete({ _id: req.params.id, user: req.userId });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};