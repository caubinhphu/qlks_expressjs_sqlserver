const sql = require('mssql');

const pool = require('../connectDB');


module.exports.index = async (req, res, next) => {
  // res.send('Le tan');
  try {
    await pool.connect();
    var request = new sql.Request(pool);
    var result = await request.query('SELECT * FROM PHONG');
  } catch (err) {
    next(err);
  } finally {
    await pool.close();
  }

  // res.json(result.recordset);
  // res.render('letan/index', {
  //   title: 'Le tan'
  // })
}