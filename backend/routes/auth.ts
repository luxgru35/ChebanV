import { Router, Request, Response } from 'express';
import { sign, SignOptions } from 'jsonwebtoken';
import User from '@models/User';
import LoginHistory from '@models/LoginHistory';
import { sendNewDeviceAlert } from '@services/emailService';
import dotenv from 'dotenv';

dotenv.config();
const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     AuthResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         token:
 *           type: string
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *             email:
 *               type: string
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Email already exists or validation error
 */
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Create user (password will be hashed automatically by the hook)
        const user = await User.create({ name, email, password });

        // Generate JWT token
        const token = sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' } as SignOptions
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error: any) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const user = await User.findOne({
            where: {
                email,
                deletedAt: null,
            },
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Get IP address and User-Agent
        const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
        const userAgent = req.get('User-Agent') || 'unknown';

        // Check if this is a new device/IP (variant 20)
        const recentLogins = await LoginHistory.findAll({
            where: { userId: user.id },
            order: [['loginAt', 'DESC']],
            limit: 10, // Check last 10 logins
        });

        const isNewDevice = !recentLogins.some(
            (login) => login.ipAddress === (ipAddress as string) && login.userAgent === (userAgent as string)
        );

        // Save login history
        await LoginHistory.create({
            userId: user.id,
            ipAddress: ipAddress as string,
            userAgent: userAgent as string,
            loginAt: new Date(),
        });

        // Send email if new device/IP detected (variant 20)
        if (isNewDevice && recentLogins.length > 0) {
            // Only send if user has logged in before
            sendNewDeviceAlert(user.email, user.name, ipAddress as string, userAgent as string, new Date())
                .catch((err: any) => console.error('Email sending failed:', err));
        }

        // Generate JWT token
        const token = sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' } as SignOptions
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            newDeviceDetected: isNewDevice && recentLogins.length > 0,
        });
    } catch (error: any) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
});

export default router;
