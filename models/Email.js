const mongoose = require('mongoose');

const EmailSchema = new mongoose.Schema({
    emailAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmailAccount',
        required: true,
    },
    uid: {
        type: Number,
        required: true,
    },
    subject: {
        type: String,
    },
    from: [
        {
            name: String,
            address: String,
        },
    ],
    to: [
        {
            name: String,
            address: String,
        },
    ],
    cc: [
        {
            name: String,
            address: String,
        },
    ],
    textBody: {
        type: String,
    },
    htmlBody: {
        type: String,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    messageId: {
        type: String,
        unique: true,
    },
    attachments: [
        {
            filename: String,
            contentType: String,
            size: Number,
            path: String,
        },
    ],
    folder: {
        type: String, // Stores the folder name, e.g., INBOX, Sent, Trash
        default: 'INBOX',
    },
});

module.exports = mongoose.model('Email', EmailSchema);