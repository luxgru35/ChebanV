"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
const User_1 = __importDefault(require("./User"));
class LoginHistory extends sequelize_1.Model {
}
LoginHistory.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        },
    },
    ipAddress: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    userAgent: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    loginAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: db_1.default,
    tableName: 'LoginHistories',
    timestamps: false,
});
// Define associations
User_1.default.hasMany(LoginHistory, { foreignKey: 'userId', as: 'loginHistory' });
LoginHistory.belongsTo(User_1.default, { foreignKey: 'userId', as: 'user' });
exports.default = LoginHistory;
