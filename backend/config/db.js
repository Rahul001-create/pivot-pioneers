const mongoose = require('mongoose');

/**
 * Connects to MongoDB when DB_ENABLED=true and MONGO_URI is provided.
 * Remains safely disabled during local frontend demo mode.
 */
async function connectDatabase() {
  const isEnabled = process.env.DB_ENABLED === 'true';
  const uri = process.env.MONGO_URI;

  if (!isEnabled || !uri) {
    console.log('[DB] MongoDB integration disabled (running in local demo mode).');
    return { connected: false, mode: 'demo' };
  }

  try {
    await mongoose.connect(uri, {
      autoIndex: true
    });
    console.log('[DB] Connected to MongoDB.');
    return { connected: true, mode: 'mongodb' };
  } catch (error) {
    console.error('[DB] Connection failed:', error.message);
    throw error;
  }
}

module.exports = { connectDatabase };
