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
        const { subjectId, grade, grades } = jsonBody(req);
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

        if (Array.isArray(grades)) {
            subject.grades = grades
                .map((g) => Number(g))
                .filter((g) => Number.isFinite(g));
        } else if (grade !== undefined && grade !== null) {
            const numeric = Number(grade);
            if (!Number.isFinite(numeric)) {
                return res.status(400).json({ error: 'Invalid grade' });
            }
            subject.grades.push(numeric);
        } else {
            return res.status(400).json({ error: 'Missing grade or grades' });
        }

        await user.save();
        return res.json({ subject });
    } catch (err) {
        return res.status(500).json({ error: 'Server error' });
    }
};
