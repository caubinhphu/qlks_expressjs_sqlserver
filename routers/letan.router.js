const express = require('express');

const controller = require('../controllers/letan.controller');

const router = express.Router();

router.get('/', controller.index);

router.get('/khach', controller.getKhach);

router.get('/khach/search', controller.getKhachSearch);

router.get('/phong/thuephong', controller.getThuePhong);

router.post('/phong/thuephong', controller.postThuePhong);

router.get('/phong/themdichvu', controller.getThemDichVu);

router.post('/phong/themdichvu', controller.postThemDichVu);

router.get('/phong/traphong', controller.getTraPhong);

router.post('/phong/traphong', controller.postTraPhong);

router.get('/phong/:maphong', controller.getPhong);

module.exports = router;