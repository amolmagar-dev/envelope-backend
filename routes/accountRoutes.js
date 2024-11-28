const express = require('express');
const { addEmailAccount } = require('../controllers/accountController');
const router = express.Router();

router.post('/add', addEmailAccount);

module.exports = router;