import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import passport from './config/passport';
import dotenv from 'dotenv';

import sequelize from './config/db';
import corsMiddleware from './middleware/cors';
import authRoutes from './routes/auth';
import publicRoutes from './routes/public';
import userRoutes from './routes/users';
import eventRoutes from './routes/events';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(corsMiddleware);
app.use(passport.initialize());

// Logging middleware
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

// Swagger configuration
const swaggerOptions: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Events Management API',
            version: '1.0.0',
            description: 'API for managing events and users with soft delete support and JWT Auth',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{
            bearerAuth: []
        }],
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Development server',
            },
        ],
    },
    apis: ['./routes/*.ts'], // Updated to look for .ts files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Test route
app.get('/', (req: Request, res: Response) => {
    res.json({
        message: 'Events Management API',
        documentation: `http://localhost:${PORT}/api-docs`
    });
});

// Routes
app.use('/auth', authRoutes);
app.use('/public', publicRoutes);

// Protected Routes
const requireAuth = passport.authenticate('jwt', { session: false });
app.use('/users', requireAuth, userRoutes);
app.use('/events', requireAuth, eventRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
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
