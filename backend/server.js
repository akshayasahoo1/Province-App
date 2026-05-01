// ============================================
// ProvinceApp — Backend Server
// ============================================
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// ===== MIDDLEWARE =====
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS — allow frontend
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    process.env.PRODUCTION_URL,
    'http://localhost:5173',
    'https://provinceapp.in',
    'https://www.provinceapp.in'
  ],
  credentials: true
}));

// Rate limiting — prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// ===== ROUTES =====
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/restaurants',   require('./routes/restaurants'));
app.use('/api/menu',          require('./routes/menu'));
app.use('/api/orders',        require('./routes/orders'));
app.use('/api/academics',     require('./routes/academics'));
app.use('/api/pg',            require('./routes/pg'));
app.use('/api/clubs',         require('./routes/clubs'));
app.use('/api/confession',    require('./routes/confession'));
app.use('/api/discussion',    require('./routes/discussion'));
app.use('/api/lostfound',     require('./routes/lostfound'));
app.use('/api/feedback',      require('./routes/feedback'));
app.use('/api/chat',          require('./routes/chat'));
app.use('/api/mocktest',      require('./routes/mocktest'));
app.use('/api/faq',           require('./routes/faq'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/payments',      require('./routes/payments'));

// ===== HEALTH CHECK =====
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    app: 'ProvinceApp API',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime() });
});

// ===== 404 HANDLER =====
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ===== ERROR HANDLER =====
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ===== START =====
app.listen(PORT, () => {
  console.log(`✅ ProvinceApp API running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;
