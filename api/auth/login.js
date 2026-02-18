const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { connectDB, User } = require('../_lib/db');
const { jsonBody } = require('../_lib/http');

const { JWT_SECRET } = process.env;

function createToken(userId) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!JWT_SECRET) {
        return res.status(500).json({ error: 'Missing JWT_SECRET in environment variables.' });
    }

    try {
        await connectDB();
    } catch (err) {
        console.error('MongoDB connection error:', err);
        return res.status(500).json({ error: 'Database connection error' });
    }

    try {
        const { email, password } = jsonBody(req);
        if (!email || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = createToken(user._id);
        return res.json({ token });
    } catch (err) {
        return res.status(500).json({ error: 'Server error' });
    }
};
