const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const User = require('../models/User');

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
        const events = await Event.findAll({
            where: {
                deletedAt: null
            },
            include: [{
                model: User,
                as: 'creator',
                attributes: ['id', 'name', 'email']
            }]
        });
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

module.exports = router;
