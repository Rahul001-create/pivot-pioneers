require('dotenv').config();
const path = require('path');
const http = require('http');
const express = require('express');
const cors = require('cors');
const { connectDatabase } = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Serve static frontend files
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// REST API routes
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'pivot-pioneers-api',
    dbEnabled: process.env.DB_ENABLED === 'true'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

// Future Socket.IO attachment point:
// const { Server } = require('socket.io');
// const io = new Server(server, { cors: { origin: '*' } });

// Fallback to index.html for unknown non-API routes
app.get('*', (_req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

connectDatabase()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Pivot Pioneers server listening at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Server startup aborted due to database error:', err);
    process.exit(1);
  });
