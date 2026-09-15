import { PrismaClient } from '../generated/prisma/index.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding Studio CRM database with HoneyBook sample projects...');

    const email = 'test@studiocrm.dev';
    const passwordHash = await bcrypt.hash('password123', 10);

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        user = await prisma.user.create({
            data: { name: 'Alex Rivera', email, passwordHash },
        });
    }

    let org = await prisma.organization.findFirst({
        where: { memberships: { some: { userId: user.id } } },
    });

    if (!org) {
        org = await prisma.organization.create({
            data: { name: 'Aura Creative Studio' },
        });

        await prisma.membership.create({
            data: { userId: user.id, organizationId: org.id, role: 'OWNER' },
        });
    }

    // Clear existing test projects & clients cleanly if desired or upsert
    // Seed Clients matching screenshot contacts
    const clientsData = [
        { name: 'Miranda Cruz', email: 'miranda@acornassets.com' },
        { name: 'Willow Green', email: 'willow@evergreensolutions.com' },
        { name: 'River Alder', email: 'river@pristineplumbing.com' },
        { name: 'Hazel Brook', email: 'hazel@radiantrenovations.com' },
        { name: 'Forrest Banks', email: 'forrest@stellarsystems.com' },
        { name: 'Wren Hayes', email: 'wren@zenithzone.com' },
        { name: 'Indigo Lake', email: 'indigo@summitservices.com' },
        { name: 'Sage Ashwood', email: 'sage@vanguardventures.com' },
        { name: 'Rowan Thistle', email: 'rowan@titaniumtech.com' },
        { name: 'Briar Stone', email: 'briar@onyxops.com' },
        { name: 'Anna Smith', email: 'anna@apexapps.com' },
        { name: 'Maria Gonzalez', email: 'maria@novanavigation.com' },
    ];

    const clientMap = {};
    for (const c of clientsData) {
        let client = await prisma.client.findFirst({ where: { email: c.email, organizationId: org.id } });
        if (!client) {
            client = await prisma.client.create({
                data: { name: c.name, email: c.email, organizationId: org.id },
            });
        }
        clientMap[c.name] = client.id;
    }

    // Projects matching exact cards in HoneyBook screenshot
    const projectsSample = [
        // New lead (LEAD)
        { title: 'Acorn Assets', stage: 'LEAD', clientName: 'Miranda Cruz', leadSource: 'Lead form', serviceType: 'Consulting' },
        { title: 'Evergreen Solutions', stage: 'LEAD', clientName: 'Willow Green', leadSource: 'Facebook', serviceType: 'Support' },
        { title: 'Pristine Plumbing', stage: 'LEAD', clientName: 'River Alder', leadSource: 'Instagram', serviceType: 'Consulting' },

        // Contract signed (QUOTED)
        { title: 'Radiant Renovations', stage: 'QUOTED', clientName: 'Hazel Brook', leadSource: 'Lead form', serviceType: 'Development' },
        { title: 'Stellar Systems', stage: 'QUOTED', clientName: 'Forrest Banks', leadSource: 'Lead form', serviceType: 'Consulting' },

        // Invoice paid (BOOKED)
        { title: 'Zenith Zone', stage: 'BOOKED', clientName: 'Wren Hayes', leadSource: 'Google', serviceType: 'Consulting' },
        { title: 'Summit Services', stage: 'BOOKED', clientName: 'Indigo Lake', leadSource: 'Website', serviceType: 'Development' },
        { title: 'Vanguard Ventures', stage: 'BOOKED', clientName: 'Sage Ashwood', leadSource: 'Client referral', serviceType: 'Consulting' },

        // In progress (IN_PROGRESS)
        { title: 'Titanium Technologies', stage: 'IN_PROGRESS', clientName: 'Rowan Thistle', leadSource: 'Lead form', serviceType: 'Consulting' },
        { title: 'Onyx Operations', stage: 'IN_PROGRESS', clientName: 'Briar Stone', leadSource: 'Lead form', serviceType: 'Development' },

        // Completed (PAID / DELIVERED)
        { title: 'Capstone Creative', stage: 'DELIVERED', clientName: 'Briar Stone', leadSource: 'Client referral', serviceType: 'Consulting' },
        { title: 'Apex Applications', stage: 'PAID', clientName: 'Anna Smith', leadSource: 'Google', serviceType: 'Consulting' },
        { title: 'Nova Navigation', stage: 'PAID', clientName: 'Maria Gonzalez', leadSource: 'Website', serviceType: 'Consulting' },
    ];

    for (const p of projectsSample) {
        const existing = await prisma.project.findFirst({
            where: { title: p.title, organizationId: org.id },
        });

        if (!existing) {
            const createdProj = await prisma.project.create({
                data: {
                    title: p.title,
                    stage: p.stage,
                    portalToken: crypto.randomUUID(),
                    organizationId: org.id,
                    clientId: clientMap[p.clientName] || null,
                },
            });

            // Seed a sample quote for booked/paid projects
            if (['BOOKED', 'PAID', 'DELIVERED'].includes(p.stage)) {
                await prisma.quote.create({
                    data: {
                        title: `${p.title} Master Agreement`,
                        status: 'ACCEPTED',
                        totalAmount: 250000,
                        terms: 'Net 30',
                        organizationId: org.id,
                        projectId: createdProj.id,
                        items: {
                            create: [
                                { description: `${p.serviceType} Package`, quantity: 1, unitPrice: 250000, amount: 250000 },
                            ],
                        },
                    },
                });
            }
        }
    }

    console.log('Seed completed successfully!');
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());