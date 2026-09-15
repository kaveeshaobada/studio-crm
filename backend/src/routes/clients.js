const express = require('express');
const { z } = require('zod');
const prisma = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

const clientSchema = z.object({
    name: z.string().min(1),
    email: z.string().email().optional(),
    phone: z.string().optional(),
});

router.post('/', async (req, res, next) => {
    try {
        const data = clientSchema.parse(req.body);

        const client = await prisma.client.create({
            data: {
                ...data,
                organizationId: req.organizationId,
            },
        });

        res.status(201).json(client);
    } catch (err) {
        next(err);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const clients = await prisma.client.findMany({
            where: { organizationId: req.organizationId },
            orderBy: { createdAt: 'desc' },
        });

        res.json(clients);
    } catch (err) {
        next(err);
    }
});

module.exports = router;