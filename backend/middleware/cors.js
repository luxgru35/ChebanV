const cors = require('cors');
require('dotenv').config();

// Parse allowed origins from .env
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : ['http://localhost:3000'];

// Parse allowed methods from .env
const allowedMethods = process.env.ALLOWED_METHODS
    ? process.env.ALLOWED_METHODS.split(',').map(method => method.trim())
    : ['GET', 'POST', 'PUT', 'DELETE'];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: allowedMethods,
    credentials: true,
    optionsSuccessStatus: 200
};

module.exports = cors(corsOptions);
