const express = require('express');
const { z } = require('zod');
const prisma = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

const invoiceItemSchema = z.object({
    description: z.string().min(1),
    quantity: z.number().int().min(1).default(1),
    unitPrice: z.number().int().min(0), // in cents
});

const createInvoiceSchema = z.object({
    projectId: z.string().min(1),
    quoteId: z.string().optional(),
    dueDate: z.string().optional(),
    items: z.array(invoiceItemSchema).min(1, 'Invoice must contain at least one item'),
});

// GET /api/invoices - List invoices
router.get('/', async (req, res, next) => {
    try {
        const where = { organizationId: req.organizationId };
        if (req.query.projectId) {
            where.projectId = req.query.projectId;
        }

        const invoices = await prisma.invoice.findMany({
            where,
            include: {
                items: true,
                project: {
                    select: { id: true, title: true, client: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json(invoices);
    } catch (err) {
        next(err);
    }
});

// GET /api/invoices/:id - Fetch single invoice
router.get('/:id', async (req, res, next) => {
    try {
        const invoice = await prisma.invoice.findFirst({
            where: { id: req.params.id, organizationId: req.organizationId },
            include: {
                items: true,
                project: {
                    select: { id: true, title: true, client: true },
                },
            },
        });

        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        res.json(invoice);
    } catch (err) {
        next(err);
    }
});

// POST /api/invoices - Create invoice
router.post('/', async (req, res, next) => {
    try {
        const data = createInvoiceSchema.parse(req.body);

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

        const count = await prisma.invoice.count({ where: { organizationId: req.organizationId } });
        const invoiceNumber = `INV-${String(count + 1).padStart(4, '0')}`;

        const invoice = await prisma.invoice.create({
            data: {
                invoiceNumber,
                projectId: data.projectId,
                organizationId: req.organizationId,
                quoteId: data.quoteId || null,
                totalAmount,
                amountPaid: 0,
                status: 'UNPAID',
                dueDate: data.dueDate ? new Date(data.dueDate) : null,
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

        res.status(201).json(invoice);
    } catch (err) {
        next(err);
    }
});

// PATCH /api/invoices/:id/payment - Record payment against invoice
const paymentSchema = z.object({
    amountCents: z.number().int().min(1),
});

router.patch('/:id/payment', async (req, res, next) => {
    try {
        const { amountCents } = paymentSchema.parse(req.body);

        const invoice = await prisma.invoice.findFirst({
            where: { id: req.params.id, organizationId: req.organizationId },
        });

        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        const newAmountPaid = invoice.amountPaid + amountCents;
        let newStatus = invoice.status;

        if (newAmountPaid >= invoice.totalAmount) {
            newStatus = 'PAID';
        } else if (newAmountPaid > 0) {
            newStatus = 'PARTIALLY_PAID';
        }

        const updated = await prisma.$transaction(async (tx) => {
            const updatedInvoice = await tx.invoice.update({
                where: { id: invoice.id },
                data: {
                    amountPaid: newAmountPaid,
                    status: newStatus,
                },
                include: { items: true },
            });

            // If fully paid, update project stage to PAID if in IN_PROGRESS or DELIVERED
            if (newStatus === 'PAID') {
                await tx.project.update({
                    where: { id: invoice.projectId },
                    data: { stage: 'PAID' },
                });
            }

            return updatedInvoice;
        });

        res.json(updated);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
