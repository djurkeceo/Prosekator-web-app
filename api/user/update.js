const bcrypt = require('bcrypt');
const { connectDB, User } = require('../_lib/db');
const { requireAuth } = require('../_lib/auth');
const { jsonBody } = require('../_lib/http');
const { isPasswordStrong } = require('../_lib/validation');

module.exports = async (req, res) => {
    if (req.method !== 'PATCH') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        await connectDB();
    } catch (err) {
        console.error('MongoDB connection error:', err);
        return res.status(500).json({ error: 'Database connection error' });
    }

    const userId = requireAuth(req, res);
    if (!userId) {
        return;
    }

    const body = jsonBody(req);
    const updates = {};

    if (body.name && String(body.name).trim()) {
        updates.name = String(body.name).trim();
    }

    if (body.password && String(body.password).trim()) {
        if (!isPasswordStrong(body.password)) {
            return res.status(400).json({ error: 'Password must contain at least one uppercase letter and one number' });
        }
        updates.password = await bcrypt.hash(String(body.password), 10);
    }

    if (!updates.name && !updates.password) {
        return res.status(400).json({ error: 'Missing update fields' });
    }

    try {
        const user = await User.findByIdAndUpdate(userId, updates, { new: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.json({ success: true, name: user.name });
    } catch (err) {
        return res.status(500).json({ error: 'Server error' });
    }
};
