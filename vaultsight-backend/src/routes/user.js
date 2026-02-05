const express = require('express');
const router = express.Router();
const { sendMoney, getProfile, getTransactions } = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.get('/profile', getProfile);
router.post('/transfer', sendMoney);
router.get('/transactions', getTransactions);

module.exports = router;
