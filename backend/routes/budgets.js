import express from 'express';
import { protect } from '../middleware/auth.js';
import Budget from '../models/Budget.js';

const router = express.Router();

router.use(protect);

// GET all budgets
router.get('/', async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.id }).select('-__v');
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// CREATE or UPDATE budget
router.post('/', async (req, res) => {
  try {
    const { category, limit } = req.body;

    const budget = await Budget.findOneAndUpdate(
      { userId: req.user.id, category },
      { limit },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(budget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE budget
router.delete('/:id', async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });
    if (!budget) return res.status(404).json({ message: 'Budget not found' });
    res.json({ message: 'Budget deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;