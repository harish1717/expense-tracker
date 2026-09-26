const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { getBudgetStatus, setBudget } = require('../controllers/budgetController');

router.use(protect);

router.get('/:month', getBudgetStatus);
router.post('/', setBudget);

module.exports = router;