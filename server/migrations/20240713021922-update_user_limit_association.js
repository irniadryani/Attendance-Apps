'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if the column exists before attempting to add it
    const { sequelize } = queryInterface;
    const transaction = await sequelize.transaction();
    try {
      const [results] = await sequelize.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'limit_id'
      `, { transaction });

      if (results.length === 0) {
        await queryInterface.addColumn('users', 'limit_id', {
          type: Sequelize.UUID,
          allowNull: true, // or false depending on your needs
          references: {
            model: 'limits', // name of the referenced table
            key: 'id', // key in the referenced table
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        }, { transaction });
      }
      
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Add down migration logic here if necessary
    await queryInterface.removeColumn('users', 'limit_id');
  }
};
