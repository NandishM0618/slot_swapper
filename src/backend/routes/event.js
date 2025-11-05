const express = require('express')
const auth = require('../middleware/auth')
const { getEvents, createEvent, getMyEvents, updateEventStatus, deleteEvent } = require('../controllers/event')

const router = express()

router.get("/", auth, getEvents)
router.get("/me", auth, getMyEvents)
router.post("/", auth, createEvent);
router.patch("/:id/status", auth, updateEventStatus);
router.delete("/:id", auth, deleteEvent)

module.exports = router