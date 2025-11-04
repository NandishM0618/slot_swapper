const mongoose = require('mongoose')

const swapRequestSchema = new mongoose.Schema({
    mySlot: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    theirSlot: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    responder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['PENDING', 'ACCEPTED', 'REJECTED'], default: 'PENDING' }
}, { timestamps: true })

const SwapRequest = mongoose.model("SwapRequest", swapRequestSchema)

module.exports = SwapRequest