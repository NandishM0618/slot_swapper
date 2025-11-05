const router = require('express').Router();
const { getSwapableSlots, createSwapRequest, createSwapResponse } = require('../controllers/swap');
const auth = require('../middleware/auth')

router.get('/swappable-slots', getSwapableSlots);
router.post('/swap-request', createSwapRequest);
router.post('/swap-reponse/:requestId', createSwapResponse);

module.exports = router