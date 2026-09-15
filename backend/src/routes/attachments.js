const express = require('express');
const { z } = require('zod');
const prisma = require('../db');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

router.use(requireAuth);

const createAttachmentSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    url: z.string().url('Must be a valid URL (e.g. Vimeo, Dropbox, Frame.io, Google Drive, R2)'),
    type: z.enum(['DELIVERABLE', 'BRIEF', 'CONTRACT', 'GENERAL']).default('GENERAL'),
    isClientVisible: z.boolean().default(true),
    projectId: z.string().min(1, 'Project ID is required'),
});

// GET /api/attachments?projectId=...
router.get('/', async (req, res) => {
    try {
        const { projectId } = req.query;
        if (!projectId) {
            return res.status(400).json({ error: 'projectId query parameter is required' });
        }

        // Check project ownership
        const project = await prisma.project.findFirst({
            where: {
                id: projectId,
                organizationId: req.organizationId
            }
        });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const attachments = await prisma.attachment.findMany({
            where: {
                projectId,
                organizationId: req.organizationId
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(attachments);
    } catch (err) {
        console.error('GET /api/attachments error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/attachments
router.post('/', async (req, res) => {
    try {
        const data = createAttachmentSchema.parse(req.body);

        // Verify project belongs to organization
        const project = await prisma.project.findFirst({
            where: {
                id: data.projectId,
                organizationId: req.organizationId
            }
        });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const attachment = await prisma.attachment.create({
            data: {
                name: data.name,
                url: data.url,
                type: data.type,
                isClientVisible: data.isClientVisible,
                projectId: data.projectId,
                organizationId: req.organizationId
            }
        });

        // Log activity
        await prisma.activityLog.create({
            data: {
                type: 'PROJECT_CREATED', // keep activity log clean
                description: `Added attachment "${attachment.name}" to project "${project.title}"`,
                organizationId: req.organizationId,
                projectId: project.id
            }
        });

        res.status(201).json(attachment);
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ error: err.errors[0].message });
        }
        console.error('POST /api/attachments error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE /api/attachments/:id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const attachment = await prisma.attachment.findFirst({
            where: {
                id,
                organizationId: req.organizationId
            }
        });

        if (!attachment) {
            return res.status(404).json({ error: 'Attachment not found' });
        }

        await prisma.attachment.delete({
            where: { id }
        });

        res.json({ message: 'Attachment deleted successfully' });
    } catch (err) {
        console.error('DELETE /api/attachments/:id error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
