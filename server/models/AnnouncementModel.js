"use strict";

const { DataTypes } = require("sequelize");
const sequelize = require("../config/connection.js");

const Users = require("./UserModel"); // Pastikan Anda sudah memiliki model User

const Announcements = sequelize.define(
  "announcements",
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
    admin_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Users,
        key: "id",
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Announcements.belongsTo(Users, { foreignKey: "admin_id" });

module.exports = Announcements;
