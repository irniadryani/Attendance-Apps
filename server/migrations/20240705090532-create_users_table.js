'use strict'
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.sequelize.query(
			'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
		)

		return queryInterface.createTable('users', {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.literal('uuid_generate_v4()'),
				primaryKey: true,
				allowNull: false,
			},
			role_id: {
				type: Sequelize.UUID,
				allowNull: false,
				references: {
					model: 'roles', // Nama tabel referensi
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			full_name: {
				type: Sequelize.STRING(255),
				allowNull: false,
			},
			email: {
				type: Sequelize.STRING(255),
				allowNull: false,
				unique: true,
			},
			phone_number: {
				type: Sequelize.STRING(50),
				allowNull: true,
			},
			position: {
				type: Sequelize.STRING(100),
				allowNull: true,
			},
			photo_profil: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			password: {
				type: Sequelize.STRING(255),
				allowNull: false,
			},
			default_password: {
				type: Sequelize.BOOLEAN,
				defaultValue: true,
			},
			created_at: {
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
				allowNull: false,
			},
			updated_at: {
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
				allowNull: false,
			},
			deleted_at: {
				type: Sequelize.DATE,
				allowNull: true,
			},
		})
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.removeConstraint('users', 'fk_users_roles')
		await queryInterface.dropTable('users')
	},
}
