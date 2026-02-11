import { Router, Request, Response } from 'express';
import User from '@models/User';
import Event from '@models/Event';

const router = Router();

// Get Profile
router.get('/profile', async (req: Request, res: Response) => {
    // req.user is populated by passport
    const user = req.user as User;
    res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
    });
});

// Get User's Created Events
router.get('/events', async (req: Request, res: Response) => {
    try {
        const user = req.user as User;
        const events = await Event.findAll({
            where: { 
                createdBy: user.id,
                deletedAt: null // Фильтруем удаленные события
            },
            order: [['date', 'DESC']],
            include: [{
                model: User,
                as: 'participants',
                attributes: ['id', 'name', 'email'],
                through: { attributes: [] }
            }]
        });
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user events' });
    }
});

// Delete User (Soft Delete) - Lab 1 Variant 20
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.id as string);
        const currentUser = req.user as User;

        // Users can only delete their own account, or admin can delete any
        if (userId !== currentUser.id) {
            return res.status(403).json({ error: 'Not authorized to delete this user' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Soft delete
        user.deletedAt = new Date();
        await user.save();

        res.json({ message: 'User soft deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

export default router;
