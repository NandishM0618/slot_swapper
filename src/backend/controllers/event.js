const Event = require('../models/event')

async function getEvents(req, res) {
    try {
        const events = await Event.find({ owner: req.user._id }).sort({ startTime: 1 });
        if (!events) {
            return res.status(404).json({ message: "No events found" });
        }
        res.status(200).json(events);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}


async function createEvent(req, res) {
    try {
        const { title, startTime, endTime } = req.body;
        if (!title || !startTime || !endTime) return res.status(400).json({ message: "Missing fields" });
        const event = await Event.create({ title, startTime, endTime, owner: req.user._id, status: "BUSY" });
        res.status(201).json(event);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

module.exports = { getEvents, createEvent }