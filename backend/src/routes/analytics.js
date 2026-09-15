const express = require('express');
const prisma = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

// GET /api/analytics/stats - Financial & Pipeline Summary Stats
router.get('/stats', async (req, res, next) => {
    try {
        const orgId = req.organizationId;

        const invoices = await prisma.invoice.findMany({
            where: { organizationId: orgId },
            select: { totalAmount: true, amountPaid: true, status: true },
        });

        let totalRevenue = 0;
        let pendingReceivables = 0;

        invoices.forEach((inv) => {
            totalRevenue += inv.amountPaid;
            if (inv.status !== 'PAID') {
                pendingReceivables += (inv.totalAmount - inv.amountPaid);
            }
        });

        const projects = await prisma.project.findMany({
            where: { organizationId: orgId },
            select: { id: true, stage: true },
        });

        const stageCounts = {
            LEAD: 0,
            QUOTED: 0,
            BOOKED: 0,
            IN_PROGRESS: 0,
            DELIVERED: 0,
            PAID: 0,
        };

        let bookedOrCompletedCount = 0;

        projects.forEach((proj) => {
            if (stageCounts[proj.stage] !== undefined) {
                stageCounts[proj.stage] += 1;
            }
            if (['BOOKED', 'IN_PROGRESS', 'DELIVERED', 'PAID'].includes(proj.stage)) {
                bookedOrCompletedCount += 1;
            }
        });

        const totalProjects = projects.length;
        const conversionRate = totalProjects > 0 ? Math.round((bookedOrCompletedCount / totalProjects) * 100) : 0;

        res.json({
            totalRevenue,
            pendingReceivables,
            totalProjects,
            conversionRate,
            stageCounts,
        });
    } catch (err) {
        next(err);
    }
});

// GET /api/analytics/activity - Activity Log Feed
router.get('/activity', async (req, res, next) => {
    try {
        const logs = await prisma.activityLog.findMany({
            where: { organizationId: req.organizationId },
            include: {
                project: {
                    select: { id: true, title: true },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 25,
        });

        res.json(logs);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
