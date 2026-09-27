const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { getBudgetStatus, setBudget, deleteBudget } = require('../controllers/budgetController');

router.use(protect);

router.get('/:month', getBudgetStatus);
router.post('/', setBudget);
router.delete('/:id', deleteBudget);

module.exports = router;