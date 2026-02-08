const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const LoginHistory = sequelize.define('LoginHistory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        },
    },
    ipAddress: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userAgent: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    loginAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: false,
});

// Define relationship
User.hasMany(LoginHistory, { foreignKey: 'userId', as: 'loginHistory' });
LoginHistory.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = LoginHistory;
