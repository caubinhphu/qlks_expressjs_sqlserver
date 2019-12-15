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
      dsLoaiPhong: result.recordset
    })
  } catch (err) {
    next(err);
  } finally {
    await pool.close();
  }
};

module.exports.thongKePhong = async (req, res, next) => {

};

module.exports.thongKeDichVu = async (req, res, next) => {

};

module.exports.postGiaLoaiPhong = async (req, res, next) => {

};

module.exports.postGiaPhong = async (req, res, next) => {

};

module.exports.postGiaDichVu = async (req, res, next) => {

};
