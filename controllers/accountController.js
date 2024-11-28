const EmailAccount = require('../models/EmailAccount');
const User = require('../models/User');

// Add a new email account
const addEmailAccount = async (req, res) => {
    try {
        const { userId, emailAddress, imapConfig } = req.body;

        // Validate user existence
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Create new email account
        const newEmailAccount = await EmailAccount.create({
            user: userId,
            emailAddress,
            imapConfig,
        });

        // Link email account to user
        user.emailAccounts.push(newEmailAccount._id);
        await user.save();

        res.status(201).json(newEmailAccount);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add email account' });
    }
};

module.exports = { addEmailAccount };