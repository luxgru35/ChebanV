import { Router, Request, Response } from 'express';
import Event from '@models/Event';
import User from '@models/User';

const router = Router();

/**
 * @swagger
 * /public/events:
 *   get:
 *     summary: Get all events (public access, no authentication required)
 *     tags: [Public]
 *     parameters:
 *       - in: query
 *         name: includeDeleted
 *         schema:
 *           type: boolean
 *         description: Include soft-deleted events
 *     responses:
 *       200:
 *         description: List of events
 */
router.get('/events', async (req: Request, res: Response) => {
    try {
        const { includeDeleted } = req.query;
        const where: any = {};

        if (includeDeleted !== 'true') {
            where.deletedAt = null;
        }

        const events = await Event.findAll({
            where,
            include: [{
                model: User,
                as: 'creator',
                attributes: ['id', 'name', 'email']
            }, {
                model: User,
                as: 'participants',
                attributes: ['id', 'name', 'email'],
                through: { attributes: [] }
            }]
        });
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

export default router;
