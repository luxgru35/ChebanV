import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME as string,
    process.env.DB_USER as string,
    process.env.DB_PASSWORD as string,
    {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        dialect: 'postgres',
        logging: false,
    }
);

// Test connection
sequelize.authenticate()
    .then(() => console.log('✅ Database connection established successfully'))
    .catch((err: Error) => console.error('❌ Unable to connect to database:', err));

export default sequelize;
