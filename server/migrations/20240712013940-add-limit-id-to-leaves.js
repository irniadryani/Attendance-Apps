// migrations/YYYYMMDDHHMMSS-add-limit-id-to-leaves.js
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("leaves", "limit_id", {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: "limit",
        key: "id",
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("leaves", "limit_id");
  },
};
