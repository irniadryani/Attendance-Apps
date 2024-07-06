"use strict";

const { DataTypes } = require("sequelize");
const sequelize = require("../config/connection.js");

const Roles = sequelize.define('roles', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
}, {
    freezeTableName: true,
    timestamps: false,
});

module.exports = Roles;
