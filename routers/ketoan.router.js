const express = require("express");

const controller = require('../controllers/ketoan.controller');

const router = express.Router();

router.get('/ds-thuephong', controller.thuePhong);

router.get('/ds-thuedichvu', controller.thueDichVu);

router.post("/doanhthu/ngay", controller.postDoanhThuNgay);

router.post("/doanhthu/thang", controller.postDoanhThuThang);

router.post("/doanhthu/nam", controller.postDoanhThuNam);

router.get('/ds-thuephong/phieu/:soPhieu', controller.getInfoPhieu);

module.exports = router;