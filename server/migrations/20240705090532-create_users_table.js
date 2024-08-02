// models/UserModel.js
"use strict";

const { DataTypes } = require("sequelize");
const sequelize = require("../config/connection.js");
const Roles = require("./RolesModel");

const Users = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    role_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Roles,
        key: "id",
      },
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    photo_profil: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    default_password: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deleted_at: {
      type: DataTypes.DATE,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    paranoid: true,
  }
);

Users.belongsTo(Roles, { foreignKey: "role_id" });
Users.hasMany(Limit, { foreignKey: "user_id" }); // Define the relationship

module.exports = Users;

// "use strict";
// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     await queryInterface.sequelize.query(
//       'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
//     );

//     return queryInterface.createTable("users", {
//       id: {
//         type: Sequelize.UUID,
//         defaultValue: Sequelize.literal("uuid_generate_v4()"),
//         primaryKey: true,
//         allowNull: false,
//       },
//       role_id: {
//         type: Sequelize.UUID,
//         allowNull: false,
//         references: {
//           model: "roles", // Nama tabel referensi
//           key: "id",
//         },
//         onUpdate: "CASCADE",
//         onDelete: "CASCADE",
//       },
//       full_name: {
//         type: Sequelize.STRING(255),
//         allowNull: false,
//       },
//       email: {
//         type: Sequelize.STRING(255),
//         allowNull: false,
//         unique: true,
//       },
//       phone_number: {
//         type: Sequelize.STRING(50),
//         allowNull: true,
//       },
//       position: {
//         type: Sequelize.STRING(100),
//         allowNull: true,
//       },
//       photo_profil: {
//         type: Sequelize.STRING,
//         allowNull: true,
//       },
//       password: {
//         type: Sequelize.STRING(255),
//         allowNull: false,
//       },
//       default_password: {
//         type: Sequelize.BOOLEAN,
//         defaultValue: true,
//       },
//       created_at: {
//         type: Sequelize.DATE,
//         defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
//         allowNull: false,
//       },
//     //   url: {
//     //     type: Sequelize.STRING(255),
//     //     allowNull: true,
//     //   },
//       updated_at: {
//         type: Sequelize.DATE,
//         defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
//         allowNull: false,
//       },
//       deleted_at: {
//         type: Sequelize.DATE,
//         allowNull: true,
//       },
//     });
//   },

//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.removeConstraint("users", "fk_users_roles");
//     await queryInterface.dropTable("users");
//   },
// };
