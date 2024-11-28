const mongoose = require('mongoose');

const EmailAccountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    emailAddress: {
        type: String,
        required: true,
        unique: true,
    },
    imapConfig: {
        host: { type: String, required: true },
        port: { type: Number, required: true },
        secure: { type: Boolean, default: true },
        user: { type: String, required: true },
        password: { type: String, required: true },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('EmailAccount', EmailAccountSchema);