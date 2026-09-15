const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../src/app');

test('Auth API & Multi-Tenant Boundary Integration Test', async (t) => {
    const timestamp = Date.now();
    const emailA = `studioa_${timestamp}@studiocrm.dev`;
    const emailB = `studiob_${timestamp}@studiocrm.dev`;

    let tokenA, tokenB, orgIdA, orgIdB, projectIdA;

    await t.test('POST /api/auth/signup - Studio A signup', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({
                name: 'Studio A Owner',
                email: emailA,
                password: 'password123',
                organizationName: 'Studio A Media',
            });

        assert.strictEqual(res.status, 201);
        assert.ok(res.body.token);
        assert.ok(res.body.organization.id);
        tokenA = res.body.token;
        orgIdA = res.body.organization.id;
    });

    await t.test('POST /api/auth/signup - Studio B signup', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({
                name: 'Studio B Owner',
                email: emailB,
                password: 'password123',
                organizationName: 'Studio B Productions',
            });

        assert.strictEqual(res.status, 201);
        assert.ok(res.body.token);
        tokenB = res.body.token;
        orgIdB = res.body.organization.id;
    });

    await t.test('POST /api/projects - Studio A creates a project', async () => {
        const res = await request(app)
            .post('/api/projects')
            .set('Authorization', `Bearer ${tokenA}`)
            .send({ title: 'Studio A Commercial' });

        assert.strictEqual(res.status, 201);
        assert.ok(res.body.id);
        assert.strictEqual(res.body.organizationId, orgIdA);
        projectIdA = res.body.id;
    });

    await t.test('GET /api/projects - Studio B cannot see Studio A projects', async () => {
        const res = await request(app)
            .get('/api/projects')
            .set('Authorization', `Bearer ${tokenB}`);

        assert.strictEqual(res.status, 200);
        const hasStudioAProject = res.body.some((p) => p.id === projectIdA);
        assert.strictEqual(hasStudioAProject, false);
    });

    await t.test('PATCH /api/projects/:id/stage - Studio B cannot mutate Studio A project stage', async () => {
        const res = await request(app)
            .patch(`/api/projects/${projectIdA}/stage`)
            .set('Authorization', `Bearer ${tokenB}`)
            .send({ stage: 'BOOKED' });

        assert.strictEqual(res.status, 404);
    });
});
