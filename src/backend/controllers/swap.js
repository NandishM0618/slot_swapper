const SwapRequest = require('../models/swaprequest')
const Event = require('../models/event')

async function getSwapableSlots(req, res) {
    try {
        const slots = await Event.find({
            owner: { $ne: req.user._id },
            status: "SWAPPABLE"
        }).populate("owner", "name email");

        res.status(200).json(slots);
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
            receiver: theirSlot.owner,
            mySlot: mySlotId,
            theirSlot: theirSlotId,
        });

        mySlot.status = "SWAP_PENDING";
        theirSlot.status = "SWAP_PENDING";
        await mySlot.save();
        await theirSlot.save();

        res.status(201).json({ message: "Swap request sent", swap });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
}

async function createSwapResponse(req, res) {
    try {
        const { accept } = req.body;
        const { requestId } = req.params;

        const swap = await SwapRequest.findById(requestId)
            .populate("mySlot")
            .populate("theirSlot");

        if (!swap || swap.receiver.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const mySlot = await Event.findById(swap.theirSlot);
        const theirSlot = await Event.findById(swap.mySlot);

        if (!accept) {
            swap.status = "REJECTED";
            await swap.save();

            mySlot.status = "SWAPPABLE";
            theirSlot.status = "SWAPPABLE";
            await mySlot.save();
            await theirSlot.save();

            return res.json({ message: "Swap rejected" });
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

        res.json({ message: "Swap accepted & calendar updated" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    getSwapableSlots, createSwapRequest, createSwapResponse
}