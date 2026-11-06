const router = require('express').Router();
const { protect } = require('../middleware/auth');
router.get('/stats', protect, require('../controllers/dashboardController').stats);
module.exports = router;
