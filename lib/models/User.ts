import mongoose, { Schema, type Model, type Types } from "mongoose";

export type StoredGrade = {
  id: string;
  value: number;
  description: string;
  createdAt: Date;
};

export type StoredSubject = {
  _id: Types.ObjectId;
  name: string;
  color?: string | null;
  grades: unknown[];
  markModified?: (path: string) => void;
};

export type UserRecord = {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  subjects: StoredSubject[];
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Grades are intentionally stored as Mixed so that accounts created by the
 * previous version (where grades were plain numbers) keep working. Every read
 * normalises them into { id, value, description, createdAt } objects.
 */
const subjectSchema = new Schema<StoredSubject>(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    color: { type: String, default: null },
    grades: { type: [Schema.Types.Mixed], default: [] },
  },
  { _id: true }
);

const userSchema = new Schema<UserRecord>(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    subjects: { type: [subjectSchema], default: [] },
  },
  { timestamps: true }
);

export const User: Model<UserRecord> =
  (mongoose.models.User as Model<UserRecord>) || mongoose.model<UserRecord>("User", userSchema);
