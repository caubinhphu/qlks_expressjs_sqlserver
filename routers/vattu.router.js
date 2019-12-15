const express = require('express');

const controller = require('../controllers/vattu.controller');

const router = express.Router();

router.get('/phong', controller.getPhong);

router.post('/phong/:maphong', controller.postTrangThai);

module.exports = router;