const Email = require('../models/Email');
const EmailAccount = require('../models/EmailAccount');
const { ImapFlow } = require('imapflow');
const { simpleParser } = require('mailparser');
const fs = require('fs');
const path = require('path');

// Fetch emails from a specific folder and store them in the database
const fetchEmails = async (req, res) => {
    try {
        const { accountId, folder = 'INBOX' } = req.query; // Default to INBOX if folder is not specified

        // Validate email account
        const emailAccount = await EmailAccount.findById(accountId);
        if (!emailAccount) {
            return res.status(404).json({ error: 'Email account not found' });
        }

        // Configure IMAP client
        const client = new ImapFlow({
            host: emailAccount.imapConfig.host,
            port: emailAccount.imapConfig.port,
            secure: emailAccount.imapConfig.secure,
            auth: {
                user: emailAccount.imapConfig.user,
                pass: emailAccount.imapConfig.password,
            },
        });

        // Connect to IMAP server
        await client.connect();

        // Lock the mailbox (specified folder)
        let lock = await client.getMailboxLock(folder);

        try {
            console.log(`Connected to mailbox: ${emailAccount.emailAddress}, Folder: ${folder}`);

            const emails = [];

            // Fetch emails (e.g., last 10 messages for demo purposes)
            for await (const message of client.fetch('1:*', { envelope: true, source: true })) {
                const parsed = await simpleParser(message.source);

                // Check if the email already exists in the database (using messageId)
                const existingEmail = await Email.findOne({ messageId: parsed.messageId });
                if (existingEmail) continue;

                // Process attachments
                const attachments = [];
                if (parsed.attachments && parsed.attachments.length > 0) {
                    for (const attachment of parsed.attachments) {
                        const attachmentPath = path.join(
                            __dirname,
                            '../attachments',
                            `${attachment.filename}`
                        );

                        // Save the attachment to the file system
                        fs.writeFileSync(attachmentPath, attachment.content);

                        attachments.push({
                            filename: attachment.filename,
                            contentType: attachment.contentType,
                            size: attachment.size,
                            path: attachmentPath,
                        });
                    }
                }

                // Create a new email object
                const newEmail = await Email.create({
                    emailAccount: emailAccount._id,
                    uid: message.uid,
                    subject: parsed.subject || '(No Subject)',
                    from: parsed.from.value,
                    to: parsed.to ? parsed.to.value : [],
                    cc: parsed.cc ? parsed.cc.value : [],
                    textBody: parsed.text,
                    htmlBody: parsed.html,
                    isRead: false,
                    createdAt: new Date(parsed.date),
                    messageId: parsed.messageId,
                    attachments,
                    folder, // Save the folder name for this email
                });

                emails.push(newEmail);
            }

            console.log(`Fetched ${emails.length} new emails from ${folder}`);
            res.status(200).json(emails);
        } finally {
            lock.release(); // Always release the mailbox lock
        }

        // Disconnect from the IMAP server
        await client.logout();
    } catch (error) {
        console.error('Error fetching emails:', error);
        res.status(500).json({ error: 'Failed to fetch emails' });
    }
};

module.exports = { fetchEmails };