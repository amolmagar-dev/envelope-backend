const express = require('express');
const { fetchEmails } = require('../controllers/emailController');
const router = express.Router();

router.get('/fetch', fetchEmails);

module.exports = router;