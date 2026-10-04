const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  register, login, getCategories, addCategory, deleteCategory, updateProfile, changePassword,
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

router.get('/categories', protect, getCategories);
router.post('/categories', protect, addCategory);
router.delete('/categories/:name', protect, deleteCategory);

router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);

module.exports = router;