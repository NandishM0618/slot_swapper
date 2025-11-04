const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
        type: String,
        enum: ['BUSY', 'SWAPPABLE', 'SWAP_PENDING'],
        default: 'BUSY'
    }
}, { timestamps: true })

const Event = mongoose.model('Event', eventSchema)

module.exports = Event