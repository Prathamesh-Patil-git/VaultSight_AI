const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { login, getMe } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const loginValidation = [
  body('username').notEmpty().withMessage('Username is required').trim(),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

router.post('/login', loginValidation, login);
router.post('/admin-login', loginValidation, login); 
router.get('/me', verifyToken, getMe);

module.exports = router;

