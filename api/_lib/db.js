const mongoose = require('mongoose');

const { MONGO_URI, MONGODB_URI } = process.env;

const cached = global._mongoose || (global._mongoose = { conn: null, promise: null });

async function connectDB() {
    const mongoUri = MONGO_URI || MONGODB_URI;
    if (!mongoUri) {
        throw new Error('Missing MONGO_URI or MONGODB_URI in environment variables.');
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(mongoUri).then((conn) => conn);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

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

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = { connectDB, User };
