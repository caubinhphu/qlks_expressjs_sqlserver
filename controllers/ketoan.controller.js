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

module.exports.getInfoPhieu = async (req, res, next) => {
  try {
    await pool.connect();
    var requset = new sql.Request(pool);
    requset.input('SOPHIEU', parseInt(req.params.soPhieu));
    var result = await requset.execute('SP_INFO_THUEPHONG');
    // res.json(result);
    res.render('ketoan/infothuephong', {
      title: 'Vitamin Sea Hotel: Info thuê phòng',
      active: 'tab1',
      phieu: result.recordsets[0][0],
      dsThueDV: result.recordsets[1],
      dsTonThat: result.recordsets[2],
      history: req.headers.referer
    });
  } catch(err) {
    next(err);
  } finally {
    await pool.close();
  }
};