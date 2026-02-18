const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

function requireAuth(req, res) {
    if (!JWT_SECRET) {
        res.status(500).json({ error: 'Missing JWT_SECRET in environment variables.' });
        return null;
    }

    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
        res.status(401).json({ error: 'Missing token' });
        return null;
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        return payload.userId;
    } catch (err) {
        res.status(401).json({ error: 'Invalid or expired token' });
        return null;
    }
}

module.exports = { requireAuth };
