const Event = require('../models/event')

async function getEvents(req, res) {
    try {
        const events = await Event.find({ owner: req.user._id })
            .populate("owner", "name email")
            .sort({ startTime: 1 });

        return res.status(200).json({
            success: true,
            events
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}



async function createEvent(req, res) {
    try {
        const { title, startTime, endTime, status } = req.body;
        if (!title || !startTime || !endTime) return res.status(400).json({ message: "Missing fields" });
        const event = await Event.create({ title, startTime, endTime, owner: req.user._id, status });
        res.status(201).json(event);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

module.exports = { getEvents, createEvent }