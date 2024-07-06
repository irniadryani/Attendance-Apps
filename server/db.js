const { Sequelize } = require('sequelize');

const db = new Sequelize('attendance_app', 'postgres', 'irinn1601', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = db;
