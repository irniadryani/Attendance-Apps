// LeavesModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/connection.js");

const Users = require("./UserModel");
const Limit = require("./LimitModel.js");

const Leaves = sequelize.define(
  "leaves",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Users,
        key: "id",
      },
    },
    limit_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Limit,
        key: "id",
      },
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["Submitted", "Approved", "Rejected", "Canceled"]],
      },
    },
    notes: {
      type: DataTypes.TEXT,
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

Leaves.belongsTo(Users, { foreignKey: "user_id" });
Leaves.belongsTo(Limit, { foreignKey: "limit_id" });

module.exports = Leaves;

// // models/LeavesModel.js
// "use strict";

// const { DataTypes } = require("sequelize");
// const sequelize = require("../config/connection.js");

// const Users = require("./UserModel");
// const Limit = require("./LimitModel");

// const Leaves = sequelize.define(
//   "leaves",
//   {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//       allowNull: false,
//       validate: {
//         notEmpty: true,
//       },
//     },
//     user_id: {
//       type: DataTypes.UUID,
//       allowNull: false,
//       references: {
//         model: Users,
//         key: "id",
//       },
//     },
//     limit_id: {
//       type: DataTypes.UUID,
//       allowNull: true,
//       references: {
//         model: Limit,
//         key: "id",
//       },
//     },
//     start_date: {
//       type: DataTypes.DATE,
//       allowNull: false,
//       validate: {
//         notEmpty: true,
//       },
//     },
//     end_date: {
//       type: DataTypes.DATE,
//       allowNull: false,
//       validate: {
//         notEmpty: true,
//       },
//     },
//     status: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         isIn: [["Submitted", "Approved", "Rejected"]],
//         notEmpty: true,
//       },
//     },
//     notes: {
//       type: DataTypes.TEXT,
//       allowNull: true,
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
//     freezeTableName: true,
//     timestamps: true,
//     createdAt: "created_at",
//     updatedAt: "updated_at",
//   }
// );

// Leaves.belongsTo(Users, { foreignKey: "user_id" });
// Leaves.belongsTo(Limit, { foreignKey: "limit_id" });

// module.exports = Leaves;
