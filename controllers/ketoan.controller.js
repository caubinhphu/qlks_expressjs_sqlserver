const sql = require('mssql');

const pool = require('../connectDB');

module.exports.thuePhong = async (req, res, next) => {
  try {
    await pool.connect();
    var request = new sql.Request(pool);
    var result = await request.execute('SP_DANHSACH_ALL_THUEPHONG');
    res.render('ketoan/dsthuephong', {
      active: 'tab1',
      title: 'Vitamin Sea hotel: Danh sách thuê phòng',
      dsPhieuDang: result.recordsets[0],
      dsPhieuDa: result.recordsets[1]
    })
  } catch(err) {
    next(err);
  } finally {
    await pool.close();
  }
};

module.exports.thueDichVu = async (req, res, next) => {
  try {
    await pool.connect();
    var request = new sql.Request(pool);
    var result = await request.execute('SP_DANHSACH_ALL_THUEDICHVU');
    res.render('ketoan/dsthuedichvu', {
      active: 'tab2',
      title: 'Vitamin Sea hotel: Danh sách thuê dịch vụ',
      dsDang: result.recordsets[0],
      dsDa: result.recordsets[1]
    })
  } catch(err) {
    next(err);
  } finally {
    await pool.close();
  }
};

module.exports.postDoanhThuNgay = async (req, res, next) => {

};

module.exports.postDoanhThuTuan = async (req, res, next) => {

};

module.exports.postDoanhThuThang = async (req, res, next) => {

};

module.exports.postDoanhThuNam = async (req, res, next) => {

};