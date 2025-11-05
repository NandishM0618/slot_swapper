const SwapRequest = require('../models/swaprequest')
const Event = require('../models/event')
const mongoose = require('mongoose')

async function getSwapableSlots(req, res) {
    try {
        const slots = await Event.find({
            owner: { $ne: mongoose.Types.ObjectId.createFromHexString(req.user._id.toString()) },
            status: "SWAPPABLE"
        }).populate("owner", "name email");

        res.status(200).json({ slots });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
}

async function getSwapRequests(req, res) {
    try {
        const requests = await SwapRequest.find({ responder: req.user._id, status: "PENDING" })
            .populate({
                path: "mySlot",
                select: "title startTime endTime status",
            })
            .populate({
                path: "theirSlot",
                select: "title startTime endTime status",
            })
            .populate({
                path: "requester",
                select: "name email",
            })
            .sort({ createdAt: -1 })

        res.status(200).json({ success: true, requests });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
}


async function createSwapRequest(req, res) {
    try {
        const { mySlotId, theirSlotId } = req.body;

        const mySlot = await Event.findOne({
            _id: mySlotId,
            owner: req.user._id,
            status: "SWAPPABLE"
        });

        const theirSlot = await Event.findOne({
            _id: theirSlotId,
            owner: { $ne: req.user._id },
            status: "SWAPPABLE"
        });

        if (!mySlot || !theirSlot) {
            return res.status(400).json({ message: "Invalid or non-swappable slots" });
        }

        const swap = await SwapRequest.create({
            requester: req.user._id,
            responder: theirSlot.owner,
            mySlot: mySlotId,
            theirSlot: theirSlotId,
            status: "PENDING"
        });

        mySlot.status = "SWAP_PENDING";
        theirSlot.status = "SWAP_PENDING";
        await mySlot.save();
        await theirSlot.save();


        const populatedSwap = await SwapRequest.findById(swap._id)
            .populate({
                path: "requester",
                select: "name email",
            })
            .populate({
                path: "mySlot",
                select: "title startTime endTime status",
            })
            .populate({
                path: "theirSlot",
                select: "title startTime endTime status",
            });

        return res.status(201).json({ message: "Swap request sent", swapRequest: populatedSwap });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
}


async function createSwapResponse(req, res) {
    try {
        const { accept } = req.body;
        const { requestId } = req.params;

        const swap = await SwapRequest.findById(requestId)
            .populate("mySlot")
            .populate("theirSlot");

        if (!swap || swap.responder.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const mySlot = await Event.findById(swap.theirSlot._id);
        const theirSlot = await Event.findById(swap.mySlot._id);

        if (!accept) {
            swap.status = "REJECTED";
            await swap.save();

            mySlot.status = "SWAPPABLE";
            theirSlot.status = "SWAPPABLE";
            await mySlot.save();
            await theirSlot.save();

            return res.json({ message: "Swap rejected", swap });
        }

        const tempOwner = mySlot.owner;
        mySlot.owner = theirSlot.owner;
        theirSlot.owner = tempOwner;

        mySlot.status = "BUSY";
        theirSlot.status = "BUSY";

        swap.status = "ACCEPTED";

        await mySlot.save();
        await theirSlot.save();
        await swap.save();

        res.json({ message: "Swap accepted & calendar updated", swap, mySlot, theirSlot });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    getSwapableSlots, createSwapRequest, createSwapResponse, getSwapRequests
}