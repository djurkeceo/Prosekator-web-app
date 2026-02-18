const { connectDB, User } = require('../../_lib/db');
const { requireAuth } = require('../../_lib/auth');

module.exports = async (req, res) => {
    if (req.method !== 'DELETE') {
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
        const subjectId = req.query.id;
        if (!subjectId) {
            return res.status(400).json({ error: 'Missing subjectId' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const subject = user.subjects.id(subjectId);
        if (!subject) {
            return res.status(404).json({ error: 'Subject not found' });
        }

        subject.deleteOne();
        await user.save();

        return res.json({ success: true });
    } catch (err) {
        return res.status(500).json({ error: 'Server error' });
    }
};
