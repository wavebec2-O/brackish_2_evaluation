const Event = require('../models/Event');
const User = require('../models/User');

exports.getEventReports = async (req, res) => {
    try {
        const events = await Event.find().populate('organizer', ['name', 'email']);
        const eventCount = events.length;
        // Add more statistics as needed

        res.json({ eventCount });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getUserReports = async (req, res) => {
    try {
        const users = await User.find();
        const userCount = users.length;
        // Add more statistics as needed

        res.json({ userCount });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
