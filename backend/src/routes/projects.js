const express = require('express');
const crypto = require('crypto');
const { z } = require('zod');
const prisma = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

const projectSchema = z.object({
    title: z.string().min(1),
    clientId: z.string().optional(),
    stage: z.enum(['LEAD', 'QUOTED', 'BOOKED', 'IN_PROGRESS', 'DELIVERED', 'PAID']).optional(),
});

router.post('/', async (req, res, next) => {
    try {
        const data = projectSchema.parse(req.body);

        // ownership check — a clientId must belong to the requester's own organization
        if (data.clientId) {
            const client = await prisma.client.findFirst({
                where: { id: data.clientId, organizationId: req.organizationId },
            });
            if (!client) {
                return res.status(400).json({ error: 'Invalid clientId' });
            }
        }

        const project = await prisma.project.create({
            data: {
                title: data.title,
                stage: data.stage,
                clientId: data.clientId,
                organizationId: req.organizationId,
                portalToken: crypto.randomUUID(),
            },
        });

        await prisma.activityLog.create({
            data: {
                organizationId: req.organizationId,
                projectId: project.id,
                type: 'PROJECT_CREATED',
                description: `Created new project "${project.title}"`,
            },
        });

        res.status(201).json(project);
    } catch (err) {
        next(err);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const projects = await prisma.project.findMany({
            where: { organizationId: req.organizationId },
            include: { client: true },
            orderBy: { createdAt: 'desc' },
        });

        // Ensure legacy seed rows get a portalToken assigned on demand
        const updatedProjects = await Promise.all(
            projects.map(async (project) => {
                if (!project.portalToken) {
                    const token = crypto.randomUUID();
                    return await prisma.project.update({
                        where: { id: project.id },
                        data: { portalToken: token },
                        include: { client: true },
                    });
                }
                return project;
            })
        );

        res.json(updatedProjects);
    } catch (err) {
        next(err);
    }
});


router.patch('/:id/stage', async (req, res, next) => {
    try {
        const { stage } = z
            .object({ stage: z.enum(['LEAD', 'QUOTED', 'BOOKED', 'IN_PROGRESS', 'DELIVERED', 'PAID']) })
            .parse(req.body);

        // scoped update: findFirst check first, so we never leak whether a foreign-org project exists
        const project = await prisma.project.findFirst({
            where: { id: req.params.id, organizationId: req.organizationId },
        });
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const updated = await prisma.project.update({
            where: { id: req.params.id },
            data: { stage },
        });

        await prisma.activityLog.create({
            data: {
                organizationId: req.organizationId,
                projectId: updated.id,
                type: 'STAGE_CHANGED',
                description: `Moved "${updated.title}" to ${stage.replace('_', ' ')}`,
            },
        });

        res.json(updated);
    } catch (err) {
        next(err);
    }
});

module.exports = router;