"use strict";

const { DataTypes } = require("sequelize");
const sequelize = require("../config/connection.js");

const Blacklist = sequelize.define("blacklist", {
  token: {
    type: DataTypes.TEXT,
    allowNull: false,
    primaryKey: true
  },
  expiry: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

module.exports = Blacklist;
