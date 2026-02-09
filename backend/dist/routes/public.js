"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Event_1 = __importDefault(require("../models/Event"));
const User_1 = __importDefault(require("../models/User"));
const router = (0, express_1.Router)();
/**
 * @swagger
 * /public/events:
 *   get:
 *     summary: Get all events (public access, no authentication required)
 *     tags: [Public]
 *     responses:
 *       200:
 *         description: List of events
 */
router.get('/events', async (req, res) => {
    try {
        const events = await Event_1.default.findAll({
            where: {
                deletedAt: null
            },
            include: [{
                    model: User_1.default,
                    as: 'creator',
                    attributes: ['id', 'name', 'email']
                }]
        });
        res.json(events);
    }
    catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});
exports.default = router;
