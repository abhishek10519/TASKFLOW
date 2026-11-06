const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const t = require('../controllers/taskController');
const status = body('status').isIn(['todo', 'in-progress', 'done']).withMessage('Invalid status');
const taskRules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('status').optional().isIn(['todo', 'in-progress', 'done']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('dueDate').optional({ values: 'falsy' }).isISO8601().withMessage('Invalid due date'),
];
router.use(protect);
router.put('/:id', taskRules, validate, t.update);
router.patch('/:id/status', status, validate, t.updateStatus);
router.delete('/:id', t.remove);
module.exports = router;
module.exports.taskRules = taskRules;
