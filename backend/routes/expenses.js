import express from 'express';
import { protect } from '../middleware/auth.js';
import Expense from '../models/Expense.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// GET all expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id })
      .sort({ date: -1 })
      .select('-__v');
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// CREATE expense
router.post('/', async (req, res) => {
  try {
    const { title, amount, category, date, notes } = req.body;
    const expense = new Expense({
      userId: req.user.id,
      title,
      amount,
      category,
      date: date || Date.now(),
      notes
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE expense
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;