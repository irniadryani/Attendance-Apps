// models/Setting.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/connection'); // Adjust the path as per your project structure

const Setting = sequelize.define('setting', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    default_photo_profile: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    default_password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    latitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true,
    },
    longitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true,
    },
    limit_leaves: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    limit_permission: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = Setting;
