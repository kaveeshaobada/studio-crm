const express = require('express');
const { z } = require('zod');
const prisma = require('../db');
const router = express.Router();

// GET /api/public/portal/:portalToken - Fetch client portal details (unauthenticated)
router.get('/:portalToken', async (req, res, next) => {
    try {
        const project = await prisma.project.findUnique({
            where: { portalToken: req.params.portalToken },
            select: {
                id: true,
                title: true,
                stage: true,
                portalToken: true,
                organization: {
                    select: { name: true },
                },
                client: {
                    select: { name: true, email: true },
                },
                quotes: {
                    include: { items: true },
                    orderBy: { createdAt: 'desc' },
                },
                invoices: {
                    include: { items: true },
                    orderBy: { createdAt: 'desc' },
                },
                attachments: {
                    where: { isClientVisible: true },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!project) {
            return res.status(404).json({ error: 'Client portal not found' });
        }

        res.json(project);
    } catch (err) {
        next(err);
    }
});

const respondSchema = z.object({
    action: z.enum(['ACCEPT', 'DECLINE']),
});

// POST /api/public/portal/:portalToken/quotes/:quoteId/respond - Accept/Decline quote as client
router.post('/:portalToken/quotes/:quoteId/respond', async (req, res, next) => {
    try {
        const { action } = respondSchema.parse(req.body);

        const project = await prisma.project.findUnique({
            where: { portalToken: req.params.portalToken },
        });

        if (!project) {
            return res.status(404).json({ error: 'Client portal not found' });
        }

        const quote = await prisma.quote.findFirst({
            where: { id: req.params.quoteId, projectId: project.id },
        });

        if (!quote) {
            return res.status(404).json({ error: 'Quote not found for this project' });
        }

        const newStatus = action === 'ACCEPT' ? 'ACCEPTED' : 'DECLINED';

        const result = await prisma.$transaction(async (tx) => {
            const updatedQuote = await tx.quote.update({
                where: { id: quote.id },
                data: { status: newStatus },
                include: { items: true },
            });

            let updatedProjectStage = project.stage;
            if (action === 'ACCEPT') {
                const updatedProj = await tx.project.update({
                    where: { id: project.id },
                    data: { stage: 'BOOKED' },
                });
                updatedProjectStage = updatedProj.stage;

                const existingInvoice = await tx.invoice.findFirst({ where: { quoteId: quote.id } });
                if (!existingInvoice) {
                    const count = await tx.invoice.count({ where: { organizationId: project.organizationId } });
                    const invoiceNumber = `INV-${String(count + 1).padStart(4, '0')}`;
                    const quoteItems = await tx.quoteItem.findMany({ where: { quoteId: quote.id } });

                    await tx.invoice.create({
                        data: {
                            invoiceNumber,
                            organizationId: project.organizationId,
                            projectId: project.id,
                            quoteId: quote.id,
                            totalAmount: quote.totalAmount,
                            amountPaid: 0,
                            status: 'UNPAID',
                            items: {
                                create: quoteItems.map((item) => ({
                                    description: item.description,
                                    quantity: item.quantity,
                                    unitPrice: item.unitPrice,
                                    amount: item.amount,
                                })),
                            },
                        },
                    });
                }
            }

            return { quote: updatedQuote, projectStage: updatedProjectStage };
        });

        res.json(result);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
