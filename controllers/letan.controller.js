const sql = require('mssql');

const pool = require('../connectDB');


module.exports.index = async (req, res, next) => {
  try {
    await pool.connect();
    var request = new sql.Request(pool);
    var result = await request.execute('SP_DANHSACHPHONG_TRANGTHAI');
  } catch (err) {
    next(err);
  } finally {
    await pool.close();
  }

  res.render('letan/index', {
    title: 'Vitamin Sea: Phòng',
    active: 'tab1',
    dsPhong: result.recordsets[0],
    dsTrangThai: result.recordsets[1],
    dsLoaiPhong: result.recordsets[2]
  });
};

module.exports.getKhach = async (req, res, next) => {
  try {
    await pool.connect();
    var request = new sql.Request(pool);
    var requestQuocTich = new sql.Request(pool);
    var result = await request.execute('SP_THONGTIN_ALL_KHACH');
    var dsQuocTich = await requestQuocTich.execute('SP_XUAT_QUOCTICH');
  } catch(err) {
    next(err);
  } finally {
    await pool.close();
  }
  res.render('letan/khach', {
    title: 'Vitamin Sea: Khách',
    active: 'tab2',
    dsQT: dsQuocTich.recordset,
    dsKhach: result.recordset
  });
};

module.exports.getKhachSearch = async (req, res, nex) => {
  var keys = Object.keys(req.query);
  var data = req.query;
  for(let key of keys) {
    if (data[key] === '') {
      data[key] =  null;
    }
  }
  if (data.MA !== null) {
    data.MA = parseInt(data.MA);
  }

  try {
    await pool.connect();
    var request = new sql.Request(pool);
    var requestQuocTich = new sql.Request(pool);
    for(let key of keys) {
      if (data[key] !== null) {
        request.input(`${key}`, data[key]);
      }
    }
    var result = await request.execute('SP_TIMKIEM_KHACH2');
    var dsQuocTich = await requestQuocTich.execute('SP_XUAT_QUOCTICH');
  } catch(err) {
    next(err);
  } finally {
    await pool.close();
  }
  res.render('letan/khach', {
    title: 'Vitamin Sea: Khách',
    active: 'tab2',
    values: data,
    dsQT: dsQuocTich.recordset,
    dsKhach: result.recordset
  });
};

module.exports.getPhong = async (req, res, next) => {
  try {
    await pool.connect();
    var request = new sql.Request(pool);
    request.input('MAPHONG', req.params.maphong);
    var phongInfo = await request.execute('SP_XUAT_THONGTIN_PHONG');
    var thuePhongInfo = await request.execute('SP_KHACH_THUEPHONG');
  } catch(err) {
    next(err);
  } finally {
    await pool.close();
  }
  res.render('letan/phong', {
    title: 'Vitamin Sea: Phòng',
    active: 'tab1',
    phong: phongInfo.recordsets[0][0],
    dsVatTu: phongInfo.recordsets[1],
    thuePhongInfo: thuePhongInfo.recordset[0],
    dichVuThue: thuePhongInfo.recordsets[1]
  });
};

module.exports.getThuePhong = async (req, res, next) => {
  var phong = null;
  if (req.headers.referer) {
    phong = req.headers.referer.split('/').pop();
  }
  try {
    await pool.connect();
    var request = new sql.Request(pool);
    // var dsPhongSanSang = await request.execute('SP_PHONG_SANSANG');
    var dsThuePhong = await request.execute('SP_DANHSACH_THUEPHONG');
  } catch(err) {
    next(err);
  } finally {
    await pool.close();
  }

  res.render('letan/thuephong', {
    title: 'Vitamin Sea: Thuê phòng',
    active: 'tab1',
    // dsPhongSS: dsPhongSanSang.recordset,
    dsThue: dsThuePhong.recordset,
    phong: phong
  });
};

module.exports.postThuePhong = async (req, res, next) => {
  var data = req.body;
  for (let i in data) {
    if (data[i] === '') {
      data[i] = null;
    }
  }
  data.SONGUOI = parseInt(data.SONGUOI);
  try {
    await pool.connect();
    var request = new sql.Request(pool);
    for (let i in data) {
      request.input(i, data[i]);
    }
    await request.execute('SP_THEMPHIEU');
  } catch(err) {
    next(err);
  } finally {
    await pool.close();
  }

  res.redirect(`/letan/phong/${data.MAPHONG}`);
};

module.exports.getThemDichVu = async (req, res, next) => {
  var phong = null;
  if (req.headers.referer) {
    phong = req.headers.referer.split('/').pop();
  }
  try {
    await pool.connect();
    var request = new sql.Request(pool);
    var dsDichVu = await request.execute('SP_DANHSACH_DICHVU');
    // var dsPhongDangThue = await request.execute('SP_DANHSACH_PHONGDUOCTHUE');
  } catch(err) {
    next(err);
  } finally {
    await pool.close();
  }

  res.render('letan/themdichvu', {
    title: 'Vitamin Sea: Thêm dịch vụ',
    active: 'tab1',
    dsDichVu: dsDichVu.recordset,
    // dsPhongThue: dsPhongDangThue.recordset,
    phong: phong
  });
};

module.exports.postThemDichVu = async (req, res, next) => {
  var data = req.body;
  for (let i in data) {
    if (data[i] === '') {
      data[i] = null;
    }
  }
  data.SL = parseInt(data.SL);
  try {
    await pool.connect();
    var request = new sql.Request(pool);
    for (let i in data) {
      request.input(i, data[i]);
    }
    await request.execute('SP_THEM_THUE_DICHVU');
  } catch(err) {
    next(err);
  } finally {
    await pool.close();
  }
  res.redirect(`/letan/phong/${data.MAPHONG}`);
};

module.exports.getTraPhong = async (req, res, next) => {
  var phong = null;
  if (req.headers.referer) {
    phong = req.headers.referer.split('/').pop();
  }

  try {
    await pool.connect();
    var request = new sql.Request(pool);
    // var dsPhongDangThue = await request.execute('SP_DANHSACH_PHONGDUOCTHUE');
    var dsVatTu = await request.execute('SP_DANHSACH_VATTU');
  } catch(err) {
    next(err);
  } finally {
    await pool.close();
  }

  res.render('letan/traphong', {
    title: 'Vitamin Sea: Trả phòng',
    active: 'tab1',
    dsVatTu: dsVatTu.recordset,
    phong: phong
  });
};

module.exports.postTraPhong = async (req, res, next) => {
  var data = req.body;
  for (let i in data) {
    if (data[i] === '') {
      data[i] = null;
    }
  }
  if (data.tonthat) {
    data.tonthat = JSON.parse(`{${data.tonthat.slice(0, data.tonthat.length - 1)}}`);
  }
  try {
    await pool.connect();
    var request1 = new sql.Request(pool);
    request1.input('MAPHONG', data.MAPHONG);
    request1.input('MANV', 'FO001');
    await request1.execute('SP_TRAPHONG_B1'); // trả phòng bước 1
    
    if (data.tonthat) { // trả phòng bước 2
      for (let tt in data.tonthat) {
        var request2 = new sql.Request(pool);
        request2.input('MAPHONG', data.MAPHONG);
        request2.input('MAVT', tt);
        request2.input('SL', data.tonthat[tt]);
        await request2.execute('SP_TRAPHONG_B2_TONTHAT');
      }
    }
    
    var request3 = new sql.Request(pool);
    request3.input('MAPHONG', data.MAPHONG);
    var hoaDon = await request3.execute('SP_TRAPHONG_B3_HOADON'); // trả phòng bước 3
    
    var request4 = new sql.Request(pool);
    request4.input('MAPHONG', data.MAPHONG);
    await request4.execute('SP_TRAPHONG_B4'); // trả phòng bước 4
  } catch(err) {
    next(err);
  } finally {
    await pool.close();
  }
  res.redirect(`/letan/phong/${data.MAPHONG}`);
};