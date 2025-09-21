import mongoose from 'mongoose';

const NGOSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    website: { type: String },
    focus_areas: { type: String }, // CSV or JSON string
  },
  { timestamps: true }
);

export const NGO = mongoose.model('NGO', NGOSchema);
