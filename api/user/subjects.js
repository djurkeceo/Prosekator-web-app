const { connectDB, User } = require('../_lib/db');
const { requireAuth } = require('../_lib/auth');
const { jsonBody } = require('../_lib/http');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
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
        const { name } = jsonBody(req);
        if (!name) {
            return res.status(400).json({ error: 'Missing subject name' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.subjects.push({ name, grades: [] });
        await user.save();

        const newSubject = user.subjects[user.subjects.length - 1];
        return res.status(201).json({ subject: newSubject });
    } catch (err) {
        return res.status(500).json({ error: 'Server error' });
    }
};
