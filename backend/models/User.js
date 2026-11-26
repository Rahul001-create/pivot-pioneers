const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['freelancer', 'client'], required: true },
    subRole: { type: String, trim: true },
    headline: { type: String, default: '' },
    about: { type: String, default: '' },
    education: { type: String, default: '' },
    institution: { type: String, default: '' },
    company: { type: String, default: '' },
    skills: [{ type: String, trim: true }],
    experience: [
      {
        title: String,
        organization: String,
        period: String,
        description: String
      }
    ],
    portfolioProjects: [
      {
        title: String,
        description: String,
        link: String,
        tags: [String]
      }
    ],
    resumeName: { type: String, default: '' },
    portfolioLinks: [{ label: String, url: String }],
    socialLinks: {
      github: String,
      linkedin: String,
      website: String
    },
    preferences: {
      emailNotifications: { type: Boolean, default: true },
      projectAlerts: { type: Boolean, default: true },
      messageAlerts: { type: Boolean, default: true },
      profileVisibility: { type: String, enum: ['public', 'platform', 'private'], default: 'platform' }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
