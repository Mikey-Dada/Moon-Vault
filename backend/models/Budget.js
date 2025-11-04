import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Other'],
        message: 'Invalid category'
      }
    },
    limit: {
      type: Number,
      required: [true, 'Budget limit is required'],
      min: [0, 'Limit cannot be negative']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Ensure one budget per user per category
budgetSchema.index({ userId: 1, category: 1 }, { unique: true });

export default mongoose.model('Budget', budgetSchema);