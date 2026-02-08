const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const User = require('../models/User');
const { Op } = require('sequelize');

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - title
 *         - date
 *         - createdBy
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated event ID
 *         title:
 *           type: string
 *           description: Event title
 *         description:
 *           type: string
 *           description: Event description
 *         date:
 *           type: string
 *           format: date-time
 *           description: Event date
 *         createdBy:
 *           type: integer
 *           description: ID of user who created the event
 *         createdAt:
 *           type: string
 *           format: date-time
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events (excluding soft-deleted)
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: List of events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */
router.get('/', async (req, res) => {
    try {
        // Only get events that are not soft-deleted
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

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Event details
 *       404:
 *         description: Event not found
 */
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findOne({
            where: {
                id: req.params.id,
                deletedAt: null
            },
            include: [{
                model: User,
                as: 'creator',
                attributes: ['id', 'name', 'email']
            }]
        });

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.json(event);
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ error: 'Failed to fetch event' });
    }
});

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - date
 *               - createdBy
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               createdBy:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Event created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', async (req, res) => {
    try {
        const { title, description, date, createdBy } = req.body;

        if (!title || !date || !createdBy) {
            return res.status(400).json({ error: 'Title, date, and createdBy are required' });
        }

        // Verify that the user exists and is not soft-deleted
        const user = await User.findOne({
            where: {
                id: createdBy,
                deletedAt: null
            }
        });

        if (!user) {
            return res.status(400).json({ error: 'User not found or has been deleted' });
        }

        const event = await Event.create({ title, description, date, createdBy });
        res.status(201).json(event);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Failed to create event' });
    }
});

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       404:
 *         description: Event not found
 */
router.put('/:id', async (req, res) => {
    try {
        const event = await Event.findOne({
            where: {
                id: req.params.id,
                deletedAt: null
            }
        });

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        const { title, description, date } = req.body;

        if (title !== undefined) event.title = title;
        if (description !== undefined) event.description = description;
        if (date !== undefined) event.date = date;

        await event.save();
        res.json(event);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Failed to update event' });
    }
});

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Soft delete an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Event soft deleted successfully
 *       404:
 *         description: Event not found
 */
router.delete('/:id', async (req, res) => {
    try {
        const event = await Event.findOne({
            where: {
                id: req.params.id,
                deletedAt: null
            }
        });

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Soft delete: set deletedAt to current timestamp
        event.deletedAt = new Date();
        await event.save();

        res.json({ message: 'Event deleted successfully', event });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ error: 'Failed to delete event' });
    }
});

module.exports = router;
