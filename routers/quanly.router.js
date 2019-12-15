const express = require('express');

const controller = require('../controllers/quanly.controller');

const router = express.Router();

router.get('/thongke-loaiphong', controller.thongKeLoaiPhong);

router.get('/thongke-phong', controller.thongKePhong);

router.get('/thongke-dichvu', controller.thongKeDichVu);

router.post('/capnhat-gia-loaiphong', controller.postGiaLoaiPhong);

router.post('/capnhat-gia-phong', controller.postGiaPhong);

router.post('/capnhat-gia-dichvu', controller.postGiaDichVu);

module.exports = router;