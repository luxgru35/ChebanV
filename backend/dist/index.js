"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const passport_1 = __importDefault(require("./config/passport"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const cors_1 = __importDefault(require("./middleware/cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const public_1 = __importDefault(require("./routes/public"));
const users_1 = __importDefault(require("./routes/users"));
const events_1 = __importDefault(require("./routes/events"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(express_1.default.json());
app.use(cors_1.default);
app.use(passport_1.default.initialize());
// Logging middleware
app.use((0, morgan_1.default)(':method :url :status :res[content-length] - :response-time ms'));
// Swagger configuration
const swaggerOptions = {
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
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
// Test route
app.get('/', (req, res) => {
    res.json({
        message: 'Events Management API',
        documentation: `http://localhost:${PORT}/api-docs`
    });
});
// Routes
app.use('/auth', auth_1.default);
app.use('/public', public_1.default);
// Protected Routes
const requireAuth = passport_1.default.authenticate('jwt', { session: false });
app.use('/users', requireAuth, users_1.default);
app.use('/events', requireAuth, events_1.default);
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
        await db_1.default.sync({ alter: true });
        console.log('✅ Database synchronized');
        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
