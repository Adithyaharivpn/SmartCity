const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const waterController = require('../controllers/waterController');
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
  body('address').isLength({ min: 5 }).withMessage('Address too short'),
  body('issueType').isIn(['leak', 'supply', 'quality', 'other']).withMessage('Invalid issue type'),
  runValidation,
  waterController.createWater
);

// admin listing
router.get('/', adminOnly, waterController.listWater);
// my submissions
router.get('/mine', auth, waterController.listMine);
// update (admin)
router.put('/:id', adminOnly, waterController.updateWater);
// delete (admin)
router.delete('/:id', adminOnly, waterController.deleteWater);

module.exports = router;