const sql = require('mssql');

const pool = require('../connectDB');

module.exports.thongKeLoaiPhong = async (req, res, next) => {
  try {
    await pool.connect();
    var request = new sql.Request(pool);
    var result = await request.execute("SP_THONGKE_LOAIPHONG");
    var dsInfo = await request.execute('SP_DANHSACH_CAPNHAT_GIA');
    var SDN = false;
    var SCNGLP = false;
    if (req.signedCookies) {
      if (req.signedCookies.SDN === 'true') {
        SDN = true;
        res.clearCookie('SDN');
      }
      if (req.signedCookies.SCNGLP === 'true') {
        SCNGLP = true;
        res.clearCookie('SCNGLP');
      }
    }
    res.render('quanly/loaiphong', {
      title: 'Vitamin Sea: Thống kê loại phòng',
      active: 'tab1',
      dsThongKe: result.recordset,
      // user: req.signedCookies.user,
      dsLoaiPhong: dsInfo.recordsets[0],
      dsPhong: dsInfo.recordsets[1],
      dsDichVu: dsInfo.recordsets[2],
      SDN: SDN,
      SCNGLP: SCNGLP
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
    var dsInfo = await request.execute('SP_DANHSACH_CAPNHAT_GIA');
    var SCNGP = false;
    if (req.signedCookies) {
      if (req.signedCookies.SCNGP === 'true') {
        SCNGP = true;
        res.clearCookie('SCNGP');
      }
    }
    res.render('quanly/phong', {
      title: 'Vitamin Sea: Thống kê phòng',
      active: 'tab2',
      dsThongKe: result.recordset,
      // user: req.signedCookies.user,
      dsLoaiPhong: dsInfo.recordsets[0],
      dsPhong: dsInfo.recordsets[1],
      dsDichVu: dsInfo.recordsets[2],
      SCNGP: SCNGP
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
    var dsInfo = await request.execute('SP_DANHSACH_CAPNHAT_GIA');
    var SCNDV = false;
    if (req.signedCookies) {
      if (req.signedCookies.SCNDV === 'true') {
        SCNDV = true;
        res.clearCookie('SCNDV');
      }
    }
    res.render('quanly/dichvu', {
      title: 'Vitamin Sea: Thống kê dịch vụ',
      active: 'tab3',
      dsThongKe: result.recordset,
      // user: req.signedCookies.user,
      dsLoaiPhong: dsInfo.recordsets[0],
      dsPhong: dsInfo.recordsets[1],
      dsDichVu: dsInfo.recordsets[2],
      SCNDV: SCNDV
    })
  } catch (err) {
    next(err);
  } finally {
    await pool.close();
  }
};

module.exports.postGiaLoaiPhong = async (req, res, next) => {
  try {
    await pool.connect();
    var request = new sql.Request(pool);
    request.input('MALP', req.body.MALP);
    request.input('GIA', parseInt(req.body.GIA));
    await request.execute("SP_CAPNHAT_GIA_LOAIPHONG");
    res.cookie('SCNGLP', true, { signed: true });
    res.redirect('/quanly/thongke-loaiphong');
  } catch (err) {
    next(err);
  } finally {
    await pool.close();
  }
};

module.exports.postGiaPhong = async (req, res, next) => {
  try {
    await pool.connect();
    var request = new sql.Request(pool);
    request.input('MAP', req.body.MAP);
    request.input('GIA', parseInt(req.body.GIA));
    await request.execute("SP_CAPNHAT_GIA_PHONG");
    res.cookie('SCNGP', true, { signed: true });
    res.redirect('/quanly/thongke-phong');
  } catch (err) {
    next(err);
  } finally {
    await pool.close();
  }
};

module.exports.postGiaDichVu = async (req, res, next) => {
  try {
    await pool.connect();
    var request = new sql.Request(pool);
    request.input('MADV', req.body.MADV);
    request.input('GIA', parseInt(req.body.GIA));
    await request.execute("SP_CAPNHAT_GIA_DICHVU");
    res.cookie('SCNGDV', true, { signed: true });
    res.redirect('/quanly/thongke-dichvu');
  } catch (err) {
    next(err);
  } finally {
    await pool.close();
  }
};
