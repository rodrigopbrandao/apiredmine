const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journal');
const jwtService = require('../services/jwt');

router.post('/findByParams', jwtService.verifyJWT, journalController.findByParams);
module.exports = router;