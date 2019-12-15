const sql = require('mssql');

const pool = require('../connectDB');

module.exports.thongKeLoaiPhong = async (req, res, next) => {
  try {
    await pool.connect();
    var request = new sql.Request(pool);
    var result = await request.execute("SP_THONGKE_LOAIPHONG");
    res.render('quanly/loaiphong', {
      title: 'Vitamin Sea: Thống kê loại phòng',
      active: 'tab1',
      dsThongKe: result.recordset,
      user: req.signedCookies.user
    })
  } catch (err) {
    next(err);
  } finally {
    await pool.close();
  }
};

module.exports.thongKePhong = async (req, res, next) => {
  try {
    await pool.connect();
    var request = new sql.Request(pool);
    var result = await request.execute("SP_THONGKE_PHONG");
    res.render('quanly/phong', {
      title: 'Vitamin Sea: Thống kê phòng',
      active: 'tab2',
      dsThongKe: result.recordset,
      user: req.signedCookies.user
    })
  } catch (err) {
    next(err);
  } finally {
    await pool.close();
  }
};

module.exports.thongKeDichVu = async (req, res, next) => {
  try {
    await pool.connect();
    var request = new sql.Request(pool);
    var result = await request.execute("SP_THONGKE_DICHVU");
    res.render('quanly/dichvu', {
      title: 'Vitamin Sea: Thống kê dịch vụ',
      active: 'tab3',
      dsThongKe: result.recordset,
      user: req.signedCookies.user
    })
  } catch (err) {
    next(err);
  } finally {
    await pool.close();
  }
};

module.exports.postGiaLoaiPhong = async (req, res, next) => {

};

module.exports.postGiaPhong = async (req, res, next) => {

};

module.exports.postGiaDichVu = async (req, res, next) => {

};
