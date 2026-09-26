const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
    getTransactions, createTransaction, updateTransaction, deleteTransaction,
} = require('../controllers/transactionController');

router.use(protect); // every route below requires login

router.get('/', getTransactions);
router.get('/reports/summary', require('../controllers/transactionController').getMonthlySummary);
router.post('/', createTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);


module.exports = router;