'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Menambahkan peran 'user'
    await queryInterface.bulkInsert('roles', [
      {
        id: uuidv4(),
        name: 'User',
      
      },
    ]);

    // Menambahkan peran 'admin'
    await queryInterface.bulkInsert('roles', [
      {
        id: uuidv4(),
        name: 'Admin',
      
      },
    ]);

    // Menambahkan peran 'superadmin'
    await queryInterface.bulkInsert('roles', [
      {
        id: uuidv4(),
        name: 'Superadmin',
      
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // Menghapus semua data peran
    await queryInterface.bulkDelete('roles', null, {});
  },
};
