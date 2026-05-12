require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const logger = require('./middleware/logger');
const analyzeRoutes = require('./routes/analyze');
const charactersRoutes = require('./routes/characters');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/douyin_ai_companion';

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(logger);

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    status: 'ok',
    service: 'douyin-ai-character-companion',
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

app.use('/api', analyzeRoutes);
app.use('/api', charactersRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, error: '接口不存在' });
});

app.use((err, _req, res, _next) => {
  console.error('[server] unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || '服务器内部错误'
  });
});

async function bootstrap() {
  mongoose.set('bufferCommands', false);
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 });
    console.log(`[server] MongoDB connected: ${MONGODB_URI}`);
  } catch (err) {
    console.warn(`[server] MongoDB unavailable, running without cache: ${err.message}`);
  }

  app.listen(PORT, () => {
    console.log(`[server] AI角色伴学服务已启动: http://localhost:${PORT}`);
  });
}

bootstrap();
