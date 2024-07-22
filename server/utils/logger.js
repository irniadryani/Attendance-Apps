const AppLog = require('../models/AppLogModel');

const logMessage = async (logLevel, message, context = null) => {
  try {
    await AppLog.create({
      log_level: logLevel,
      message: message,
      context: context ? JSON.stringify(context) : null
    });
  } catch (error) {
    console.error('Failed to log message:', error);
  }
};

module.exports = { logMessage };
