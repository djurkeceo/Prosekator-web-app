require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const authenticate = require('./jwtMiddleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

const { MONGO_URI, JWT_SECRET } = process.env;
const PORT = process.env.PORT || 3000;

if (!MONGO_URI || !JWT_SECRET) {
    console.error('Missing MONGO_URI or JWT_SECRET in environment variables.');
    process.exit(1);
}

mongoose
    .connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

const subjectSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        grades: { type: [Number], default: [] }
    },
    { _id: true }
);

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true },
        subjects: { type: [subjectSchema], default: [] }
    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function isEmailValid(email) {
    return emailRegex.test(String(email || '').trim());
}

function isPasswordStrong(password) {
    const value = String(password || '');
    return /[A-Z]/.test(value) && /[0-9]/.test(value);
}

function createToken(userId) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

app.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
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
        return res.status(201).json({ token, name: user.name });
    } catch (err) {
        return res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
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
        return res.json({ token, name: user.name });
    } catch (err) {
        return res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/user/data', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('subjects name');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.json({ subjects: user.subjects, name: user.name });
    } catch (err) {
        return res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/user/name', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('name');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.json({ name: user.name });
    } catch (err) {
        return res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/user/subjects', authenticate, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Missing subject name' });
        }

        const user = await User.findById(req.userId);
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
});

app.post('/api/user/grades', authenticate, async (req, res) => {
    try {
        const { subjectId, grade, grades } = req.body;
        if (!subjectId) {
            return res.status(400).json({ error: 'Missing subjectId' });
        }

        const user = await User.findById(req.userId);
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
});

app.delete('/api/user/subjects/:id', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const subject = user.subjects.id(req.params.id);
        if (!subject) {
            return res.status(404).json({ error: 'Subject not found' });
        }

        subject.deleteOne();
        await user.save();

        return res.json({ success: true });
    } catch (err) {
        return res.status(500).json({ error: 'Server error' });
    }
});

app.patch('/api/user/update', authenticate, async (req, res) => {
    try {
        const { name, password } = req.body || {};
        const updates = {};

        if (name && String(name).trim()) {
            updates.name = String(name).trim();
        }

        if (password && String(password).trim()) {
            if (!isPasswordStrong(password)) {
                return res.status(400).json({ error: 'Password must contain at least one uppercase letter and one number' });
            }
            updates.password = await bcrypt.hash(String(password), 10);
        }

        if (!updates.name && !updates.password) {
            return res.status(400).json({ error: 'Missing update fields' });
        }

        const user = await User.findByIdAndUpdate(req.userId, updates, { new: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.json({ success: true, name: user.name });
    } catch (err) {
        return res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/api/user/delete', authenticate, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.json({ success: true });
    } catch (err) {
        return res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
