const { connectDB, User } = require('../_lib/db');
const { requireAuth } = require('../_lib/auth');

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
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

    try {
        const user = await User.findById(userId).select('subjects');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.json({ subjects: user.subjects });
    } catch (err) {
        return res.status(500).json({ error: 'Server error' });
    }
};
