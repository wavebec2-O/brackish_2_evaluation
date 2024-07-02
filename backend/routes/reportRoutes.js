const express = require('express');
const router = express.Router();
const { getEventReports, getUserReports } = require('../controllers/reportController');
const auth = require('../middleware/auth');

router.get('/events', auth, getEventReports);
router.get('/users', auth, getUserReports);

module.exports = router;
