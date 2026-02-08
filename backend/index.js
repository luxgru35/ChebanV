const express = require('express');
const morgan = require('morgan');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const sequelize = require('./config/db');
const corsMiddleware = require('./middleware/cors');
const userRoutes = require('./routes/users');
const eventRoutes = require('./routes/events');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(corsMiddleware);

// Logging middleware
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Events Management API',
            version: '1.0.0',
            description: 'API for managing events and users with soft delete support',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Development server',
            },
        ],
    },
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Test route
app.get('/', (req, res) => {
    res.json({
        message: 'Events Management API',
        documentation: `http://localhost:${PORT}/api-docs`
    });
});

// Routes
app.use('/users', userRoutes);
app.use('/events', eventRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);

    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({ error: 'CORS policy: Origin not allowed' });
    }

    res.status(500).json({ error: 'Internal server error' });
});

// Database sync and server start
const startServer = async () => {
    try {
        // Sync database models
        await sequelize.sync({ alter: true });
        console.log('✅ Database synchronized');

        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
