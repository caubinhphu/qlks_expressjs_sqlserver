const express = require('express');

const controller = require('../controllers/letan.controller');

const router = express.Router();

router.get('/', controller.index);

router.get('/khach', controller.getKhach);

router.get('/khach/search', controller.getKhachSearch);


module.exports = router;