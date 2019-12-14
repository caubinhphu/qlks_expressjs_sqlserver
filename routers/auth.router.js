const express = require('express');

const controller = require('../controllers/auth.controller');

const router = express.Router();

router.get('/', controller.indexAuth);

router.get('/logout', controller.logout);

router.post('/', controller.postAuth);

module.exports = router;