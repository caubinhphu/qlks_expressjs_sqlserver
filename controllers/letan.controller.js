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
    title: 'Danh sách phòng',
    dsPhong: result.recordsets[0],
    dsTrangThai: result.recordsets[1],
    dsLoaiPhong: result.recordsets[2]
  })
}