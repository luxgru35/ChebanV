import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '@config/db';

interface LoginHistoryAttributes {
    id: number;
    userId: number;
    ipAddress: string;
    userAgent: string;
    loginAt: Date;
}

interface LoginHistoryCreationAttributes extends Optional<LoginHistoryAttributes, 'id' | 'loginAt'> { }

class LoginHistory extends Model<LoginHistoryAttributes, LoginHistoryCreationAttributes> implements LoginHistoryAttributes {
    public id!: number;
    public userId!: number;
    public ipAddress!: string;
    public userAgent!: string;
    public loginAt!: Date;
}

LoginHistory.init(
    {
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
    },
    {
        sequelize,
        tableName: 'LoginHistories',
        timestamps: false,
    }
);

// Associations are defined in models/index.ts to avoid duplication

export default LoginHistory;
