"use strict";

const { DataTypes } = require("sequelize");
const sequelize = require("../config/connection.js");

const Users = require("./UserModel");

const Attendances = sequelize.define(
  "attendances",
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
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Users,
        key: "id",
      },
    },
    check_in: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    check_out: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    work_hours: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["Present", "Early Departure", "Late"]],
        notEmpty: true,
      },
    },
    location_lat: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
    },
    location_long: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
    },
    checkin_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    checkin_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    checkout_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    checkout_url: {
      type: DataTypes.STRING,
      allowNull: true,
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

Attendances.belongsTo(Users, { foreignKey: "user_id" });

module.exports = Attendances;
