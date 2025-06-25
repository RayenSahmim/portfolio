import mongoose, { Schema } from 'mongoose';

const MessageSchema: Schema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

// Check if the model already exists to prevent OverwriteModelError
const MessageModel = mongoose.models.messages || mongoose.model('messages', MessageSchema);

export { MessageModel };