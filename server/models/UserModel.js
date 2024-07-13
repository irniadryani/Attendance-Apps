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
    deletedAt: "deleted_at",
    paranoid: true,
  }
);

Users.belongsTo(Roles, { foreignKey: "role_id" });
// Users.hasMany(Limit, { foreignKey: "user_id" }); // Define the relationship

module.exports = Users;

// "use strict";

// const { DataTypes } = require("sequelize");
// const sequelize = require("../config/connection.js");

// const Roles = require('./RolesModel')

// const Users = sequelize.define(
// 	'users',
// 	{
// 		id: {
// 			type: DataTypes.UUID,
// 			defaultValue: DataTypes.UUIDV4,
// 			primaryKey: true,
// 			allowNull: false,
// 			validate: {
// 				notEmpty: true,
// 			},
// 		},
// 		role_id: {
// 			type: DataTypes.UUID,
// 			allowNull: false,
// 			references: {
// 				model: Roles,
// 				key: 'id',
// 			},
// 		},
// 		full_name: {
// 			type: DataTypes.STRING,
// 			allowNull: false,
// 		},
// 		email: {
// 			type: DataTypes.STRING,
// 			allowNull: false,
// 			unique: true,
// 			validate: {
// 				notEmpty: true,
// 				isEmail: true,
// 			},
// 		},
// 		phone_number: {
// 			type: DataTypes.STRING,
// 			allowNull: true,
// 		},
// 		position: {
// 			type: DataTypes.STRING,
// 			allowNull: true,
// 		},
// 		photo_profil: {
// 			type: DataTypes.STRING,
// 			allowNull: true,
// 		},
// 		password: {
// 			type: DataTypes.STRING,
// 			allowNull: false,
// 			validate: {
// 				notEmpty: true,
// 			},
// 		},
// 		default_password: {
// 			type: DataTypes.BOOLEAN,
// 			defaultValue: true,
// 		},
// 		// url: {
// 		// 	type: DataTypes.STRING(255),
// 		// 	allowNull: true,
// 		//   },
// 		created_at: {
// 			type: DataTypes.DATE,
// 			defaultValue: DataTypes.NOW,
// 		},
// 		updated_at: {
// 			type: DataTypes.DATE,
// 			defaultValue: DataTypes.NOW,
// 		},
// 	},
// 	{
// 		freezeTableName: true,
// 		timestamps: true,
// 		createdAt: 'created_at',
// 		updatedAt: 'updated_at',
// 		deletedAt: 'deleted_at',
// 		paranoid: true,
// 	}
// )

// Users.belongsTo(Roles, { foreignKey: 'role_id' })

// module.exports = Users
