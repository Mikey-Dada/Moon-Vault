import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name too short'],
      maxlength: [50, 'Name too long']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,           // ← Creates index
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// REMOVE THIS LINE — IT'S THE DUPLICATE:
// userSchema.index({ email: 1 });

export default mongoose.model('User', userSchema);