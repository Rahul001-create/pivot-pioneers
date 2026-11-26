const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    coverNote: { type: String, required: true },
    proposedTimeline: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Pending', 'Under Review', 'Shortlisted', 'Accepted', 'Rejected', 'Withdrawn'],
      default: 'Pending'
    }
  },
  { timestamps: true }
);

applicationSchema.index({ projectId: 1, freelancerId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
