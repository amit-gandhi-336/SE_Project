require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');

const { seedDb } = require('./src/database/seed');
const swaggerSpec = require('./src/config/swagger');
const errorHandler = require('./src/middleware/errorHandler');

const authRoutes = require('./src/routes/authRoutes');
const petRoutes = require('./src/routes/petRoutes');
const applicationRoutes = require('./src/routes/applicationRoutes');
const rescueAlertRoutes = require('./src/routes/rescueAlertRoutes');
const userRoutes = require('./src/routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize & Seed Database
seedDb();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'Pet Adoption & Rescue API Docs',
  customCss: '.swagger-ui .topbar { background-color: #1e293b; }'
}));

// Expose OpenAPI JSON spec
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/rescue-alerts', rescueAlertRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'Pet Adoption & Animal Rescue Management System',
    timestamp: new Date().toISOString()
  });
});

// Root path redirects to interactive Swagger API documentation
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Global Error Handler
app.use(errorHandler);

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🐾 Pet Adoption & Rescue Backend Server running!`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`📚 Swagger Docs: http://localhost:${PORT}/api-docs`);
    console.log(`🖥️ Interactive Dashboard: http://localhost:${PORT}`);
    console.log(`======================================================\n`);
  });
}

module.exports = app;
