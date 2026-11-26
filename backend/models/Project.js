const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: [
        'Web Development',
        'App Development',
        'Graphic Design',
        'UI/UX Design',
        'Content Writing',
        'Digital Marketing',
        'Data Analysis',
        'Research',
        'Other'
      ],
      required: true
    },
    description: { type: String, required: true },
    skills: [{ type: String, trim: true }],
    budget: { type: Number, required: true, min: 0 },
    duration: { type: String, required: true },
    freelancersRequired: { type: Number, default: 1, min: 1 },
    deadline: { type: Date },
    requirements: { type: String, default: '' },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['Draft', 'Open', 'In Progress', 'Submitted', 'Completed', 'Closed'],
      default: 'Open'
    },
    selectedFreelancerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    submission: {
      summary: String,
      deliverableUrl: String,
      submittedAt: Date,
      approvedAt: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
