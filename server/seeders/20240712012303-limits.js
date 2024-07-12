// seeders/YYYYMMDDHHMMSS-limits.js
"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("limit", [
      {
        id: uuidv4(),
        name: "limit_permission",
        total: 8,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        name: "limit_leaves",
        total: 12,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("limit", null, {});
  },
};
