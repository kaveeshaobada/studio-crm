const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../src/app');

test('Quote -> Client Portal -> Invoice Automation Integration Test', async (t) => {
    const timestamp = Date.now();
    const email = `portal_test_${timestamp}@studiocrm.dev`;

    let token, project, quote;

    await t.test('POST /api/auth/signup - Setup Studio', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({
                name: 'Portal Test Owner',
                email,
                password: 'password123',
                organizationName: 'Portal Test Studio',
            });

        assert.strictEqual(res.status, 201);
        token = res.body.token;
    });

    await t.test('POST /api/projects - Create Project', async () => {
        const res = await request(app)
            .post('/api/projects')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Portal Test Shoot' });

        assert.strictEqual(res.status, 201);
        assert.ok(res.body.portalToken);
        project = res.body;
    });

    await t.test('POST /api/quotes - Create Quote with items', async () => {
        const res = await request(app)
            .post('/api/quotes')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Portal Test Quote',
                projectId: project.id,
                items: [
                    { description: 'Videography', quantity: 1, unitPrice: 200000 },
                    { description: 'Editing', quantity: 1, unitPrice: 100000 },
                ],
            });

        assert.strictEqual(res.status, 201);
        assert.strictEqual(res.body.totalAmount, 300000);
        quote = res.body;
    });

    await t.test('GET /api/public/portal/:token - Unauthenticated Portal Access', async () => {
        const res = await request(app)
            .get(`/api/public/portal/${project.portalToken}`);

        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.body.title, 'Portal Test Shoot');
        assert.strictEqual(res.body.quotes.length, 1);
        assert.strictEqual(res.body.quotes[0].id, quote.id);
    });

    await t.test('POST /api/public/portal/:token/quotes/:id/respond - Client Accepts Quote', async () => {
        const res = await request(app)
            .post(`/api/public/portal/${project.portalToken}/quotes/${quote.id}/respond`)
            .send({ action: 'ACCEPT' });

        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.body.quote.status, 'ACCEPTED');
        assert.strictEqual(res.body.projectStage, 'BOOKED');
    });

    await t.test('GET /api/invoices - Verify Invoice Auto-Generated', async () => {
        const res = await request(app)
            .get(`/api/invoices?projectId=${project.id}`)
            .set('Authorization', `Bearer ${token}`);

        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.body.length > 0, true);
        assert.strictEqual(res.body[0].quoteId, quote.id);
        assert.strictEqual(res.body[0].totalAmount, 300000);
    });
});
