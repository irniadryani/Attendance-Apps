"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("users", "limit_id", {
      type: Sequelize.UUID,
      allowNull: true, // Izinkan NULL sementara
      references: {
        model: "limits",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    // Perbarui semua baris yang ada dengan nilai limit_id yang sesuai
    const [limits] = await queryInterface.sequelize.query(
      `SELECT id FROM limits WHERE name = 'limit_leaves';`
    );
    const limitId = limits[0].id;

    await queryInterface.sequelize.query(
      `UPDATE users SET limit_id = '${limitId}' WHERE limit_id IS NULL;`
    );

    // Ubah kolom limit_id menjadi NOT NULL
    await queryInterface.changeColumn("users", "limit_id", {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "limits",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("users", "limit_id");
  },
};
