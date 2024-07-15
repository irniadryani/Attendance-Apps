// LimitModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/connection.js");

const Limit = sequelize.define(
  "limits",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    maximum: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
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
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Limit;

// 'use strict';

// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/connection.js');

// const Limit = sequelize.define(
//   'Limit',
//   {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//       allowNull: false,
//     },
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     maximum: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       validate: {
//         min: 0,
//       },
//     },
//     created_at: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW,
//     },
//     updated_at: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW,
//     },
//   },
//   {
//     tableName: 'limits',
//     timestamps: true,
//     createdAt: 'created_at',
//     updatedAt: 'updated_at',
//   }
// );

// module.exports = Limit;
