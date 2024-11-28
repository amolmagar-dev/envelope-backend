const User = require('../models/User');

const registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.create({ username, password });
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username, password });
        if (!user) throw new Error('Invalid credentials');
        res.status(200).json(user);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

module.exports = { registerUser, loginUser };