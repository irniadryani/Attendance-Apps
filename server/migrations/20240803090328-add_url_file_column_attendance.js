'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('attendances', 'checkin_image', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('attendances', 'checkin_url', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('attendances', 'checkout_image', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('attendances', 'checkout_url', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('attendances', 'checkin_image');
    await queryInterface.removeColumn('attendances', 'checkin_url');
    await queryInterface.removeColumn('attendances', 'checkout_image');
    await queryInterface.removeColumn('attendances', 'checkout_url');
  }
};
