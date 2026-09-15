const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRouter = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);

const publicPortalRouter = require('./routes/publicPortal');
app.use('/api/public/portal', publicPortalRouter);

const { requireAuth } = require('./middleware/auth');


const clientsRouter = require('./routes/clients');
app.use('/api/clients', clientsRouter);

const projectsRouter = require('./routes/projects');
app.use('/api/projects', projectsRouter);

const quotesRouter = require('./routes/quotes');
app.use('/api/quotes', quotesRouter);

const invoicesRouter = require('./routes/invoices');
app.use('/api/invoices', invoicesRouter);

const analyticsRouter = require('./routes/analytics');
app.use('/api/analytics', analyticsRouter);

const attachmentsRouter = require('./routes/attachments');
app.use('/api/attachments', attachmentsRouter);

const notesRouter = require('./routes/notes');
app.use('/api/notes', notesRouter);




// centralized error handler — last middleware, catches next(err) from any route
app.use((err, req, res, next) => {
    console.error(err);
    if (err.name === 'ZodError') {
        return res.status(400).json({ error: 'Validation failed', details: err.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;


