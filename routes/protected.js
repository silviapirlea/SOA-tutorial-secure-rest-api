const express = require('express');
const verifyToken = require('../utils/verifyToken');
const { getSecretData } = require('../controllers/protectedController');
const router = express.Router();

router.get('/data', verifyToken, getSecretData);

module.exports = router;
