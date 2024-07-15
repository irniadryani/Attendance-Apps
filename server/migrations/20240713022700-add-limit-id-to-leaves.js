'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('leaves', 'limit_id', {
      type: Sequelize.UUID,
      allowNull: true, // or false, depending on your business logic
      references: {
        model: 'limits',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL', // or 'CASCADE', depending on your requirements
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('leaves', 'limit_id');
  },
};
