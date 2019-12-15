const sql = require('mssql');
const md5 = require('md5');

const pool = require('../connectDB');

module.exports.indexAuth = (req, res, next) => {
  try {
    res.render('auth/index', {
        title: 'login'
      })
  } catch (err) {
    next(err);
  }
};

module.exports.postAuth = async (req, res, next) => {
  try {
    await pool.connect();
    var username = req.body.username;
    var password = md5(req.body.password);
    var requset = new sql.Request(pool);
    requset.input('USERNAME', username);
    requset.input('PASSWORD', password);
    var result = await requset.execute('SP_CHECK_TAIKHOAN');
    console.log('Login thành công');

    var user = result.recordset[0];
    res.cookie('user', user.MA_NHANVIEN, { signed: true });
    if (user.BP === 'FO') {
      res.redirect('/letan');
    } else if (user.BP === 'CA') {
      res.redirect('/ketoan/ds-thuephong');
    } else if (user.BP === 'KH') {
      res.redirect('/vattu/phong');
    } else if (user.BP === 'MN') {
      res.redirect('/quanly/thongke-loaiphong');
    } 
  } catch(err) {
    next(err);
  } finally {
    await pool.close();
  }
};

module.exports.logout = (req, res, next) => {
  res.clearCookie('user');
  res.redirect('/login');
};