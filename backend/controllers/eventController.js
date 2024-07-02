const Event = require('../models/Event');
const User = require('../models/User');

exports.createEvent = async (req, res) => {
    const { title, description, date, location } = req.body;
    try {
        const newEvent = new Event({
            title,
            description,
            date,
            location,
            organizer: req.user.id,
        });
        const event = await newEvent.save();
        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find().populate('organizer', ['name', 'email']);
        res.json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('organizer', ['name', 'email']);
        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }
        res.json(event);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Event not found' });
        }
        res.status(500).send('Server error');
    }
};

exports.updateEvent = async (req, res) => {
    const { title, description, date, location } = req.body;
    try {
        let event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }
        if (event.organizer.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        event = await Event.findByIdAndUpdate(req.params.id, { $set: { title, description, date, location } }, { new: true });
        res.json(event);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Event not found' });
        }
        res.status(500).send('Server error');
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        let event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }
        if (event.organizer.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        await event.remove();
        res.json({ msg: 'Event removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Event not found' });
        }
        res.status(500).send('Server error');
    }
};

exports.volunteerForEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }
        if (event.volunteers.includes(req.user.id)) {
            return res.status(400).json({ msg: 'Already volunteered' });
        }
        event.volunteers.push(req.user.id);
        await event.save();
        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
const { sendEmailNotification } = require('./notificationController');

exports.createEvent = async (req, res) => {
    const { title, description, date, location } = req.body;
    try {
        const newEvent = new Event({
            title,
            description,
            date,
            location,
            organizer: req.user.id,
        });
        const event = await newEvent.save();

        // Send email notification
        const user = await User.findById(req.user.id);
        sendEmailNotification(user.email, 'Event Created', `Your event "${title}" has been created.`);

        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Similar changes for other controller functions
