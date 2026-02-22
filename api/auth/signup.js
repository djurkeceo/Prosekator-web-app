const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { connectDB, User } = require('../_lib/db');
const { jsonBody } = require('../_lib/http');
const { isEmailValid, isPasswordStrong } = require('../_lib/validation');

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
        const { name, email, password } = jsonBody(req);
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        if (!isEmailValid(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        if (!isPasswordStrong(password)) {
            return res.status(400).json({ error: 'Password must contain at least one uppercase letter and one number' });
        }

        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashed,
            subjects: []
        });

        const token = createToken(user._id);
        return res.status(201).json({ token });
    } catch (err) {
        return res.status(500).json({ error: 'Server error' });
    }
};
