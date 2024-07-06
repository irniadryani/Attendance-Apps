'use strict';
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('defaultpassword', 10);

    return queryInterface.bulkInsert('users', [
      {
        id: uuidv4(),
        role_id: '4650e94a-2018-41d0-b0e2-aedd60ef590b',
        full_name: 'Employee1',
        email: 'employee1@gmail.com',
        phone_number: '08578118273',
        position: 'Employee',
        photo_profil: null,
        password: hashedPassword,
        default_password: true,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
      {
        id: uuidv4(),
        role_id: 'ddee382a-b3b0-4758-9cc8-957936dab8d9',
        full_name: 'Admin1',
        email: 'admin1@gmail.com',
        phone_number: '08598983832',
        position: 'Manager',
        photo_profil: null,
        password: hashedPassword,
        default_password: true,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
      {
        id: uuidv4(),
        role_id: 'f08395a6-adc2-4ab6-819a-1c3e506d6914',
        full_name: 'Superadmin1',
        email: 'superadmin1@gmail.com',
        phone_number: '08567983838',
        position: 'Director',
        photo_profil: null,
        password: hashedPassword,
        default_password: true,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
