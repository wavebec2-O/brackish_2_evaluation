const express = require('express');
const router = express.Router();
const { createEvent, getEvents, getEvent, updateEvent, deleteEvent, volunteerForEvent } = require('../controllers/eventController');
const auth = require('../middleware/auth');

router.post('/', auth, createEvent);
router.get('/', getEvents);
router.get('/:id', getEvent);
router.put('/:id', auth, updateEvent);
router.delete('/:id', auth, deleteEvent);
router.post('/:id/volunteer', auth, volunteerForEvent);

module.exports = router;
