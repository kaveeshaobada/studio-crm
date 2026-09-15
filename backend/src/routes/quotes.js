const express = require('express');
const { z } = require('zod');
const prisma = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

const quoteItemSchema = z.object({
    description: z.string().min(1),
    quantity: z.number().int().min(1).default(1),
    unitPrice: z.number().int().min(0), // in cents
});

const createQuoteSchema = z.object({
    title: z.string().min(1),
    projectId: z.string().min(1),
    validUntil: z.string().optional(),
    terms: z.string().optional(),
    items: z.array(quoteItemSchema).min(1, 'Quote must contain at least one item'),
});

// POST /api/quotes - Create a quote with line items
router.post('/', async (req, res, next) => {
    try {
        const data = createQuoteSchema.parse(req.body);

        // Verify project ownership within the requester's organization
        const project = await prisma.project.findFirst({
            where: { id: data.projectId, organizationId: req.organizationId },
        });
        if (!project) {
            return res.status(400).json({ error: 'Invalid or unauthorized projectId' });
        }

        let totalAmount = 0;
        const processedItems = data.items.map((item) => {
            const amount = item.quantity * item.unitPrice;
            totalAmount += amount;
            return {
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                amount,
            };
        });

        const quote = await prisma.quote.create({
            data: {
                title: data.title,
                projectId: data.projectId,
                organizationId: req.organizationId,
                totalAmount,
                validUntil: data.validUntil ? new Date(data.validUntil) : null,
                terms: data.terms,
                status: 'DRAFT',
                items: {
                    create: processedItems,
                },
            },
            include: {
                items: true,
                project: {
                    select: { id: true, title: true },
                },
            },
        });

        res.status(201).json(quote);
    } catch (err) {
        next(err);
    }
});

// GET /api/quotes - List quotes (optionally filtered by projectId)
router.get('/', async (req, res, next) => {
    try {
        const where = { organizationId: req.organizationId };
        if (req.query.projectId) {
            where.projectId = req.query.projectId;
        }

        const quotes = await prisma.quote.findMany({
            where,
            include: {
                items: true,
                project: {
                    select: { id: true, title: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json(quotes);
    } catch (err) {
        next(err);
    }
});

// GET /api/quotes/:id - Fetch single quote details
router.get('/:id', async (req, res, next) => {
    try {
        const quote = await prisma.quote.findFirst({
            where: { id: req.params.id, organizationId: req.organizationId },
            include: {
                items: true,
                project: {
                    select: { id: true, title: true, client: true },
                },
            },
        });

        if (!quote) {
            return res.status(404).json({ error: 'Quote not found' });
        }

        res.json(quote);
    } catch (err) {
        next(err);
    }
});

// PATCH /api/quotes/:id/status - Update quote status
const updateStatusSchema = z.object({
    status: z.enum(['DRAFT', 'SENT', 'ACCEPTED', 'DECLINED', 'EXPIRED']),
});

router.patch('/:id/status', async (req, res, next) => {
    try {
        const { status } = updateStatusSchema.parse(req.body);

        const quote = await prisma.quote.findFirst({
            where: { id: req.params.id, organizationId: req.organizationId },
        });

        if (!quote) {
            return res.status(404).json({ error: 'Quote not found' });
        }

        const updated = await prisma.$transaction(async (tx) => {
            const updatedQuote = await tx.quote.update({
                where: { id: req.params.id },
                data: { status },
                include: { items: true },
            });

            // If quote is accepted, update project stage to BOOKED and create an Invoice if none exists
            if (status === 'ACCEPTED') {
                await tx.project.update({
                    where: { id: quote.projectId },
                    data: { stage: 'BOOKED' },
                });

                const existingInvoice = await tx.invoice.findFirst({
                    where: { quoteId: quote.id },
                });

                if (!existingInvoice) {
                    const count = await tx.invoice.count({ where: { organizationId: quote.organizationId } });
                    const invoiceNumber = `INV-${String(count + 1).padStart(4, '0')}`;

                    const quoteItems = await tx.quoteItem.findMany({ where: { quoteId: quote.id } });
                    
                    await tx.invoice.create({
                        data: {
                            invoiceNumber,
                            organizationId: quote.organizationId,
                            projectId: quote.projectId,
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

            return updatedQuote;
        });

        res.json(updated);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
