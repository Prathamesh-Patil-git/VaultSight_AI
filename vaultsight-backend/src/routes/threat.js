const express = require('express');
const router = express.Router();
const { getAllThreats, semanticSearch, getThreatStats } = require('../controllers/threatController');
const { verifyToken, verifySOC } = require('../middleware/auth');

router.use(verifyToken, verifySOC);

router.get('/', getAllThreats);
router.get('/stats', getThreatStats);
router.post('/semantic-search', semanticSearch);

module.exports = router;
