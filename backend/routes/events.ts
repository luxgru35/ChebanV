import { Router, Request, Response } from 'express';
import Event from '../models/Event';
import User from '../models/User';
import EventParticipant from '../models/EventParticipant';

const router = Router();

// Create Event
router.post('/', async (req: Request, res: Response) => {
    try {
        const { title, description, date } = req.body;
        const event = await Event.create({
            title,
            description,
            date,
            createdBy: (req.user as User).id,
        });
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create event' });
    }
});

// Update Event
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const event = await Event.findByPk(req.params.id as string);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        if (event.createdBy !== (req.user as User).id) {
            return res.status(403).json({ error: 'Not authorized' });
        }
        await event.update(req.body);
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update event' });
    }
});

// Delete (Soft)
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const event = await Event.findByPk(req.params.id as string);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        if (event.createdBy !== (req.user as User).id) {
            return res.status(403).json({ error: 'Not authorized' });
        }
        // Soft delete - set deletedAt instead of actually deleting
        event.deletedAt = new Date();
        await event.save();
        res.json({ message: 'Event soft deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete event' });
    }
});

// Participate Toggle
router.post('/:id/participate', async (req: Request, res: Response) => {
    try {
        const eventId = parseInt(req.params.id as string);
        const userId = (req.user as User).id;

        const event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // "В мероприятиях созданных пользователем кнопка должна отсутствовать" (Frontend check),
        // but backend should also probably block or allow?
        // Logic says "У мероприятий созданных ДРУГИМИ пользователями".
        if (event.createdBy === userId) {
            return res.status(400).json({ error: 'Cannot participate in your own event' });
        }

        const existing = await EventParticipant.findOne({ where: { userId, eventId } });

        if (existing) {
            await existing.destroy();
            res.json({ message: 'Participation canceled', participating: false });
        } else {
            await EventParticipant.create({ userId, eventId });
            res.json({ message: 'Participating', participating: true });
        }
    } catch (error) {
        console.error('Participate error:', error);
        res.status(500).json({ error: 'Failed to toggle participation' });
    }
});

// Get Participants
router.get('/:id/participants', async (req: Request, res: Response) => {
    try {
        const eventId = parseInt(req.params.id as string);
        const event = await Event.findByPk(eventId, {
            include: [{
                model: User,
                as: 'participants',
                attributes: ['id', 'name', 'email']
            }]
        });

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.json((event as any).participants);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get participants' });
    }
});

export default router;
