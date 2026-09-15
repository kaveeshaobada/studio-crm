const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const prisma = require('../db');
const router = express.Router();

const signupSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
    organizationName: z.string().min(1),
});

router.post('/signup', async (req, res, next) => {
    try {
        const data = signupSchema.parse(req.body);

        const existing = await prisma.user.findUnique({ where: { email: data.email } });
        if (existing) {
            return res.status(409).json({ error: 'Email already in use' });
        }

        const passwordHash = await bcrypt.hash(data.password, 10);

        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: { name: data.name, email: data.email, passwordHash },
            });

            const organization = await tx.organization.create({
                data: { name: data.organizationName },
            });

            await tx.membership.create({
                data: {
                    userId: user.id,
                    organizationId: organization.id,
                    role: 'OWNER',
                },
            });

            return { user, organization };
        });

        const token = jwt.sign(
            { userId: result.user.id, organizationId: result.organization.id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            token,
            user: { id: result.user.id, name: result.user.name, email: result.user.email },
            organization: { id: result.organization.id, name: result.organization.name },
        });
    } catch (err) {
        next(err);
    }
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

router.post('/login', async (req, res, next) => {
    try {
        const data = loginSchema.parse(req.body);

        const user = await prisma.user.findUnique({
            where: { email: data.email },
            include: { memberships: true },
        });

        if (!user || !user.passwordHash) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const valid = await bcrypt.compare(data.password, user.passwordHash);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // a user could belong to multiple orgs later — for now, use their first membership
        const membership = user.memberships[0];
        if (!membership) {
            return res.status(400).json({ error: 'User has no organization' });
        }

        const token = jwt.sign(
            { userId: user.id, organizationId: membership.organizationId },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email },
            organizationId: membership.organizationId,
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;