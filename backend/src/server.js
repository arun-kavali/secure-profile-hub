const app = require('./app');
const env = require('./config/env');
const { initializeDatabase } = require('./config/db');

// Initialize database on cold start
let dbInitialized = false;

const ensureDbInitialized = async () => {
  if (!dbInitialized) {
    await initializeDatabase();
    dbInitialized = true;
  }
};

// For local development
if (require.main === module) {
  const startServer = async () => {
    try {
      await ensureDbInitialized();
      app.listen(env.PORT, () => {
        console.log(`Server running on port ${env.PORT}`);
        console.log(`Environment: ${env.NODE_ENV}`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  };
  startServer();
}

// For Vercel serverless - export handler
module.exports = async (req, res) => {
  await ensureDbInitialized();
  return app(req, res);
};

// Also export app for testing
module.exports.app = app;
