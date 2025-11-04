const express = require('express')
const auth = require('../middleware/auth')
const { getEvents, createEvent } = require('../controllers/event')

const router = express()

router.get("/", auth, getEvents)
router.post("/", auth, createEvent);

module.exports = router