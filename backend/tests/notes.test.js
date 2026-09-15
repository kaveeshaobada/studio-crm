const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../src/app');

test('Project Notes & Team Stream API Integration Test', async (t) => {
    const timestamp = Date.now();
    const emailA = `notes_owner_a_${timestamp}@studiocrm.dev`;
    const emailB = `notes_owner_b_${timestamp}@studiocrm.dev`;

    let tokenA, tokenB, projectA, noteA;

    await t.test('POST /api/auth/signup - Setup Studio A', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({
                name: 'Studio A Producer',
                email: emailA,
                password: 'password123',
                organizationName: 'Studio A Productions'
            });

        assert.strictEqual(res.status, 201);
        tokenA = res.body.token;
    });

    await t.test('POST /api/auth/signup - Setup Studio B', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({
                name: 'Studio B Producer',
                email: emailB,
                password: 'password123',
                organizationName: 'Studio B Audio'
            });

        assert.strictEqual(res.status, 201);
        tokenB = res.body.token;
    });

    await t.test('POST /api/projects - Create Project for Studio A', async () => {
        const res = await request(app)
            .post('/api/projects')
            .set('Authorization', `Bearer ${tokenA}`)
            .send({ title: 'Fashion Documentary Shoot' });

        assert.strictEqual(res.status, 201);
        assert.ok(res.body.id);
        projectA = res.body;
    });

    await t.test('POST /api/notes - Studio A creates team note', async () => {
        const res = await request(app)
            .post('/api/notes')
            .set('Authorization', `Bearer ${tokenA}`)
            .send({
                content: 'Shoot confirmed for Saturday 9 AM. Location: Studio B Stage 2.',
                isPinned: true,
                projectId: projectA.id
            });

        assert.strictEqual(res.status, 201);
        assert.ok(res.body.id);
        assert.strictEqual(res.body.content, 'Shoot confirmed for Saturday 9 AM. Location: Studio B Stage 2.');
        assert.strictEqual(res.body.isPinned, true);
        noteA = res.body;
    });

    await t.test('GET /api/notes - Studio A retrieves project notes', async () => {
        const res = await request(app)
            .get(`/api/notes?projectId=${projectA.id}`)
            .set('Authorization', `Bearer ${tokenA}`);

        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.body.length, 1);
        assert.strictEqual(res.body[0].id, noteA.id);
    });

    await t.test('PATCH /api/notes/:id/pin - Studio A toggles note pin state', async () => {
        const res = await request(app)
            .patch(`/api/notes/${noteA.id}/pin`)
            .set('Authorization', `Bearer ${tokenA}`);

        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.body.isPinned, false);
    });

    await t.test('GET /api/notes - Studio B cannot access Studio A notes', async () => {
        const res = await request(app)
            .get(`/api/notes?projectId=${projectA.id}`)
            .set('Authorization', `Bearer ${tokenB}`);

        assert.strictEqual(res.status, 404);
    });

    await t.test('DELETE /api/notes/:id - Studio B cannot delete Studio A note', async () => {
        const res = await request(app)
            .delete(`/api/notes/${noteA.id}`)
            .set('Authorization', `Bearer ${tokenB}`);

        assert.strictEqual(res.status, 404);
    });

    await t.test('DELETE /api/notes/:id - Studio A deletes team note', async () => {
        const res = await request(app)
            .delete(`/api/notes/${noteA.id}`)
            .set('Authorization', `Bearer ${tokenA}`);

        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.body.message, 'Note deleted successfully');
    });
});
