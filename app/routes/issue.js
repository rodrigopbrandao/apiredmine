const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issue');
const jwtService = require('../services/jwt');

router.post('/findByParams', jwtService.verifyJWT, issueController.findByParams);
module.exports = router;