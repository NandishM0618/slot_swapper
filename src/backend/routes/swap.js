const router = require('express').Router();
const { getSwapableSlots, createSwapRequest, createSwapResponse, getSwapRequests } = require('../controllers/swap');
const auth = require('../middleware/auth')

router.get('/swappable-slots', auth, getSwapableSlots);
router.get('/swap-requests', auth, getSwapRequests);
router.post('/swap-request', auth, createSwapRequest);
router.post('/swap-response/:requestId', auth, createSwapResponse);

module.exports = router