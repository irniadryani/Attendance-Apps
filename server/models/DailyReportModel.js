"use strict";

const { DataTypes } = require("sequelize");
const sequelize = require("../config/connection.js");

const Users = require("./UserModel"); // Pastikan Anda sudah memiliki model User

const DailyReport = sequelize.define(
  "daily_reports",
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
    report_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    report_message: {
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

DailyReport.belongsTo(Users, { foreignKey: "user_id" });

module.exports = DailyReport;
