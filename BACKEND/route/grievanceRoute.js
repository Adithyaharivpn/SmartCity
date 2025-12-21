const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const grievanceController = require('../controllers/grievanceController');
const { auth, isAdmin } = require('../middleware/auth');

const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
  next();
};

const adminOnly = (req, res, next) => {
  try {
    auth(req, res, (err) => {
      if (err) return next(err);
      isAdmin(req, res, next);
    });
  } catch (err) {
    next(err);
  }
};

router.post(
  '/',
  auth,
  body('name').isLength({ min: 2 }).withMessage('Full name required'),
  body('subject').isLength({ min: 3 }).withMessage('Subject required'),
  body('description').isLength({ min: 5 }).withMessage('Description too short'),
  runValidation,
  grievanceController.createGrievance
);

// admin listing
router.get('/', adminOnly, grievanceController.listGrievances);
// my submissions
router.get('/mine', auth, grievanceController.listMine);
// update (admin)
router.put('/:id', adminOnly, grievanceController.updateGrievance);
// delete (admin)
router.delete('/:id', adminOnly, grievanceController.deleteGrievance);

module.exports = router;