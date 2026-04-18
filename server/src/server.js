require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const materialRoutes = require('./routes/materialRoutes');
const flashcardRoutes = require('./routes/flashcardRoutes');
const studyPlanRoutes = require('./routes/studyPlanRoutes');
const progressRoutes = require('./routes/progressRoutes');

const app = express();
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

// Local file uploads (MVP)
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

app.use('/api/auth', authRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/studyplans', studyPlanRoutes);
app.use('/api/progress', progressRoutes);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

function listen(port) {
  const server = app.listen(port, () => {
    console.log(`FLASHMASTER API running on http://localhost:${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Trying port ${port + 1}...`);
      listen(port + 1);
      return;
    }
    console.error('Server error:', err);
    process.exit(1);
  });
}

async function start() {
  try {
    await connectDB();
    listen(DEFAULT_PORT);
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
