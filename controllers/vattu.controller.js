const sql = require('mssql');

const pool = require('../connectDB');

module.exports.getPhong = async (req, res, next) => {
  try {
    await pool.connect();
    var request = new sql.Request(pool);
    var result = await request.execute("SP_DANHSACHPHONG_TRANGTHAI");
    var dsTrangThai = await request.execute("SP_DANHSACH_TRANGTHAI");
    var SDN = false;
    if (req.signedCookies) {
      if (req.signedCookies.SDN === 'true') {
        SDN = true;
        res.clearCookie('SDN');
      }
    }
  } catch (err) {
    next(err);
  } finally {
    await pool.close();
  }

  res.render("vattu/phong", {
    title: "Vitamin Sea: Phòng",
    active: "tab1",
    dsPhong: result.recordsets[0],
    dsTrangThai: result.recordsets[1],
    dsLoaiPhong: result.recordsets[2],
    dsTrangThai: dsTrangThai.recordset,
    // user: req.signedCookies.user,
    SDN: SDN
  });
};

module.exports.postTrangThai = async (req, res, next) => {
  var phong = req.params.maphong;
  try {
    await pool.connect();
    var request = new sql.Request(pool);
    request.input("MAPHONG", phong);
    request.input("MA_TT", req.body.MA_TT);
    await request.execute("SP_CAPNHAT_TRANGTHAIPHONG");
    res.redirect('/vattu/phong');
  } catch (err) {
    next(err);
  } finally {
    await pool.close();
  }
};