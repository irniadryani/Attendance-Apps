'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('attendances', 'work_hours', {
      type: Sequelize.STRING,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('attendances', 'work_hours', {
      type: Sequelize.NUMERIC(10, 2),
    });
  },
};
