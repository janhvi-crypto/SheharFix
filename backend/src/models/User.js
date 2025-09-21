import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['citizen', 'admin'], required: true, default: 'citizen' },
    avatarUrl: { type: String },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', UserSchema);
