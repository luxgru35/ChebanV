import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const whitelist = (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean);

const corsOptions: cors.CorsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) {
            return callback(null, true);
        }
        
        // Check if origin is in whitelist
        if (whitelist.length > 0 && whitelist.indexOf(origin) !== -1) {
            // Trusted domain - allow all methods
            callback(null, true);
        } else if (whitelist.length === 0) {
            // No whitelist configured - allow all (development mode)
            callback(null, true);
        } else {
            // Untrusted domain - reject
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: process.env.ALLOWED_METHODS || 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

export default cors(corsOptions);
