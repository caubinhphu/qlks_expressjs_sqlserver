const sql = require("mssql");

const config = {
  user: "sa",
  password: "01695402297",
  server: "localhost",
  database: "QLKS_4"
};

const pool = new sql.ConnectionPool(config);

module.exports = pool;
