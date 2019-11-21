const sql = require('mssql');

const pool = require('../connectDB');


module.exports.index = async (req, res, next) => {
  // res.send('Le tan');
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
  })
};

module.exports.getKhach = async (req, res, next) => {
  try {
    await pool.connect();
    var request = new sql.Request(pool);
    var result = await request.execute('SP_THONGTIN_ALL_KHACH');
  } catch(err) {
    next(err);
  } finally {
    await pool.close();
  }
  res.render('letan/khach', {
    title: 'Vitamin Sea: Khách',
    active: 'tab2',
    dsKhach: result.recordset
  })
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
    for(let key of keys) {
      if (data[key] !== null) {
        request.input(`${key}`, data[key]);
      }
    }
    var result = await request.execute('SP_TIMKIEM_KHACH2');
  } catch(err) {
    next(err);
  } finally {
    await pool.close();
  }
  res.render('letan/khach', {
    title: 'Vitamin Sea: Khách',
    active: 'tab2',
    values: data,
    dsKhach: result.recordset
  })
};