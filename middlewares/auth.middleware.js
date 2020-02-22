const sql = require('mssql');

const pool = require('../connectDB');

module.exports.login = async (req, res, next) => {
  try {
    if (!req.signedCookies.user) {
      res.redirect('/login');
    } else {
      await pool.connect();
      var request = new sql.Request(pool);
      request.input('USER', req.signedCookies.user);
      var checkLogin = await request.execute('SP_CHECK_LOGIN');
      if (checkLogin.recordset[0].RES) {
        await pool.close();
        res.locals.user = req.signedCookies.user;
        next();
      } else {
        await pool.close();
        res.redirect('/login');
      }
    }
  } catch(err) {
    next(err);
  }
}