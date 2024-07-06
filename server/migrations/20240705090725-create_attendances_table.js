'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    return queryInterface.createTable('attendances', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users', // Pastikan sesuai dengan nama tabel User di database
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      check_in: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      check_out: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      work_hours: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isIn: [['Present', 'Early Departure', 'Late']],
          notEmpty: true,
        },
      },
      location_lat: {
        type: Sequelize.DECIMAL(10, 7),
        allowNull: true,
      },
      location_long: {
        type: Sequelize.DECIMAL(10, 7),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('attendances');
  }
};
