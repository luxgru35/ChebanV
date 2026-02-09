import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const whitelist = (process.env.ALLOWED_ORIGINS || '').split(',');

const corsOptions: cors.CorsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: process.env.ALLOWED_METHODS || 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

export default cors(corsOptions);
