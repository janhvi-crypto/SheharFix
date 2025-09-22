import mongoose from 'mongoose';

const IssueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    category: { type: String },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    status: { type: String, enum: ['submitted','acknowledged','in_progress','resolved'], default: 'submitted' },
    location: {
      lat: { type: Number },
      lng: { type: Number },
      address: { type: String }
    },
    mediaUrl: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedNgos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'NGO' }],
    // Resolution metadata
    resolvedAt: { type: Date },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    resolutionPhotoUrl: { type: String },
    resolutionNote: { type: String },
  },
  { timestamps: true }
);

export const Issue = mongoose.model('Issue', IssueSchema);
