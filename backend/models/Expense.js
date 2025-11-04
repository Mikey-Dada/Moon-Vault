import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title too long']
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Other'],
        message: 'Invalid category'
      }
    },
    date: {
      type: Date,
      default: Date.now,
      required: true
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes too long']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Compound index for fast filtering
expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ userId: 1, category: 1 });

export default mongoose.model('Expense', expenseSchema);