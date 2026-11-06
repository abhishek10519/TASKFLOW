const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const c = require('../controllers/authController');
const email = body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail();
router.post('/register', [body('name').trim().notEmpty().withMessage('Name is required'), email,
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')], validate, c.register);
router.post('/login', [email, body('password').notEmpty().withMessage('Password is required')], validate, c.login);
router.get('/me', protect, c.me);
module.exports = router;
