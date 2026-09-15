const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../src/app');

test('Project Deliverables & Attachments API Integration Test', async (t) => {
    const timestamp = Date.now();
    const emailA = `attach_owner_a_${timestamp}@studiocrm.dev`;
    const emailB = `attach_owner_b_${timestamp}@studiocrm.dev`;

    let tokenA, tokenB, projectA, attachmentA;

    await t.test('POST /api/auth/signup - Setup Studio A', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({
                name: 'Studio A Owner',
                email: emailA,
                password: 'password123',
                organizationName: 'Studio A Media'
            });

        assert.strictEqual(res.status, 201);
        tokenA = res.body.token;
    });

    await t.test('POST /api/auth/signup - Setup Studio B', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({
                name: 'Studio B Owner',
                email: emailB,
                password: 'password123',
                organizationName: 'Studio B Films'
            });

        assert.strictEqual(res.status, 201);
        tokenB = res.body.token;
    });

    await t.test('POST /api/projects - Create Project for Studio A', async () => {
        const res = await request(app)
            .post('/api/projects')
            .set('Authorization', `Bearer ${tokenA}`)
            .send({ title: 'Commercial Campaign Video Shoot' });

        assert.strictEqual(res.status, 201);
        assert.ok(res.body.id);
        assert.ok(res.body.portalToken);
        projectA = res.body;
    });

    await t.test('POST /api/attachments - Studio A adds deliverable link', async () => {
        const res = await request(app)
            .post('/api/attachments')
            .set('Authorization', `Bearer ${tokenA}`)
            .send({
                name: 'Final 4K Master Edit (Frame.io)',
                url: 'https://frame.io/f/sample-edit-link',
                type: 'DELIVERABLE',
                isClientVisible: true,
                projectId: projectA.id
            });

        assert.strictEqual(res.status, 201);
        assert.ok(res.body.id);
        assert.strictEqual(res.body.name, 'Final 4K Master Edit (Frame.io)');
        assert.strictEqual(res.body.type, 'DELIVERABLE');
        assert.strictEqual(res.body.isClientVisible, true);
        attachmentA = res.body;
    });

    await t.test('GET /api/attachments - Studio A reads deliverables', async () => {
        const res = await request(app)
            .get(`/api/attachments?projectId=${projectA.id}`)
            .set('Authorization', `Bearer ${tokenA}`);

        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.body.length, 1);
        assert.strictEqual(res.body[0].id, attachmentA.id);
    });

    await t.test('GET /api/attachments - Studio B cannot access Studio A deliverables', async () => {
        const res = await request(app)
            .get(`/api/attachments?projectId=${projectA.id}`)
            .set('Authorization', `Bearer ${tokenB}`);

        assert.strictEqual(res.status, 404);
    });

    await t.test('DELETE /api/attachments/:id - Studio B cannot delete Studio A deliverable', async () => {
        const res = await request(app)
            .delete(`/api/attachments/${attachmentA.id}`)
            .set('Authorization', `Bearer ${tokenB}`);

        assert.strictEqual(res.status, 404);
    });

    await t.test('GET /api/public/portal/:portalToken - Unauthenticated client views assets', async () => {
        const res = await request(app)
            .get(`/api/public/portal/${projectA.portalToken}`);

        assert.strictEqual(res.status, 200);
        assert.ok(res.body.attachments);
        assert.strictEqual(res.body.attachments.length, 1);
        assert.strictEqual(res.body.attachments[0].name, 'Final 4K Master Edit (Frame.io)');
    });

    await t.test('DELETE /api/attachments/:id - Studio A deletes deliverable', async () => {
        const res = await request(app)
            .delete(`/api/attachments/${attachmentA.id}`)
            .set('Authorization', `Bearer ${tokenA}`);

        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.body.message, 'Attachment deleted successfully');
    });
});
