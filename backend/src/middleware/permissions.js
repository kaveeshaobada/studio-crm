const prisma = require('../db');

function requireRole(allowedRoles = []) {
    return async (req, res, next) => {
        try {
            const membership = await prisma.membership.findUnique({
                where: {
                    userId_organizationId: {
                        userId: req.userId,
                        organizationId: req.organizationId,
                    },
                },
            });

            if (!membership || !allowedRoles.includes(membership.role)) {
                return res.status(403).json({ error: 'Forbidden: Insufficient role permissions' });
            }

            req.userRole = membership.role;
            next();
        } catch (err) {
            next(err);
        }
    };
}

module.exports = { requireRole };
