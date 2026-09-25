const Transaction = require('../models/Transaction');

exports.getTransactions = async (req, res) => {
	try {
		const transactions = await Transaction.find({ user: req.userId }).sort({ date: -1 });
		res.json(transactions);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

exports.createTransaction = async (req, res) => {
	try {
		const { type, category, amount, note, date } = req.body;
		const transaction = await Transaction.create({
			user: req.userId, type, category, amount, note, date,
		});
		res.status(201).json(transaction);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

exports.updateTransaction = async (req, res) => {
	try {
		const transaction = await Transaction.findOneAndUpdate(
			{ _id: req.params.id, user: req.userId },
			req.body,
			{ new: true }
		);
		if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
		res.json(transaction);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

exports.deleteTransaction = async (req, res) => {
	try {
		const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.userId });
		if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
		res.json({ message: 'Deleted' });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};