const express = require('express');
const { z } = require('zod');
const prisma = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

const createNoteSchema = z.object({
    content: z.string().min(1, 'Content is required'),
    isPinned: z.boolean().default(false),
    projectId: z.string().min(1, 'Project ID is required'),
    authorName: z.string().optional()
});

// GET /api/notes?projectId=...
router.get('/', async (req, res, next) => {
    try {
        const { projectId } = req.query;
        if (!projectId) {
            return res.status(400).json({ error: 'projectId query parameter is required' });
        }

        const project = await prisma.project.findFirst({
            where: {
                id: projectId,
                organizationId: req.organizationId
            }
        });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const notes = await prisma.projectNote.findMany({
            where: {
                projectId,
                organizationId: req.organizationId
            },
            orderBy: [
                { isPinned: 'desc' },
                { createdAt: 'desc' }
            ]
        });

        res.json(notes);
    } catch (err) {
        next(err);
    }
});

// POST /api/notes
router.post('/', async (req, res, next) => {
    try {
        const data = createNoteSchema.parse(req.body);

        const project = await prisma.project.findFirst({
            where: {
                id: data.projectId,
                organizationId: req.organizationId
            }
        });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const note = await prisma.projectNote.create({
            data: {
                content: data.content,
                isPinned: data.isPinned,
                authorName: data.authorName || 'Team Member',
                projectId: data.projectId,
                organizationId: req.organizationId
            }
        });

        // Log activity stream entry
        await prisma.activityLog.create({
            data: {
                type: 'PROJECT_CREATED',
                description: `Added note "${data.content.substring(0, 40)}${data.content.length > 40 ? '...' : ''}" to project "${project.title}"`,
                organizationId: req.organizationId,
                projectId: project.id
            }
        });

        res.status(201).json(note);
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ error: err.errors[0].message });
        }
        next(err);
    }
});

// PATCH /api/notes/:id/pin
router.patch('/:id/pin', async (req, res, next) => {
    try {
        const { id } = req.params;

        const existing = await prisma.projectNote.findFirst({
            where: {
                id,
                organizationId: req.organizationId
            }
        });

        if (!existing) {
            return res.status(404).json({ error: 'Note not found' });
        }

        const updated = await prisma.projectNote.update({
            where: { id },
            data: { isPinned: !existing.isPinned }
        });

        res.json(updated);
    } catch (err) {
        next(err);
    }
});

// DELETE /api/notes/:id
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const existing = await prisma.projectNote.findFirst({
            where: {
                id,
                organizationId: req.organizationId
            }
        });

        if (!existing) {
            return res.status(404).json({ error: 'Note not found' });
        }

        await prisma.projectNote.delete({
            where: { id }
        });

        res.json({ message: 'Note deleted successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
