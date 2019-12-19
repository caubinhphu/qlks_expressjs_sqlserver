const sql = require("mssql");
const fs = require("fs");
const shortid = require("shortid");
const pdf = require("html-pdf");

const pool = require("../connectDB");

module.exports.thuePhong = async (req, res, next) => {
  try {
    await pool.connect();
    var request = new sql.Request(pool);
    var result = await request.execute("SP_DANHSACH_ALL_THUEPHONG");
    var SDN = false;
    if (req.signedCookies) {
      if (req.signedCookies.SDN === 'true') {
        SDN = true;
        res.clearCookie('SDN');
      }
    }
    res.render("ketoan/dsthuephong", {
      active: "tab1",
      title: "Vitamin Sea hotel: Danh sách thuê phòng",
      dsPhieuDang: result.recordsets[0],
      dsPhieuDa: result.recordsets[1],
      user: req.signedCookies.user,
      SDN: SDN
    });
  } catch (err) {
    next(err);
  } finally {
    await pool.close();
  }
};

module.exports.thueDichVu = async (req, res, next) => {
  try {
    await pool.connect();
    var request = new sql.Request(pool);
    var result = await request.execute("SP_DANHSACH_ALL_THUEDICHVU");
    res.render("ketoan/dsthuedichvu", {
      active: "tab2",
      title: "Vitamin Sea hotel: Danh sách thuê dịch vụ",
      dsDang: result.recordsets[0],
      dsDa: result.recordsets[1],
      user: req.signedCookies.user
    });
  } catch (err) {
    next(err);
  } finally {
    await pool.close();
  }
};

module.exports.getInfoPhieu = async (req, res, next) => {
  try {
    await pool.connect();
    var requset = new sql.Request(pool);
    requset.input("SOPHIEU", parseInt(req.params.soPhieu));
    var result = await requset.execute("SP_INFO_THUEPHONG");
    var thanhToan = await requset.execute("SP_THANHTIEN_PHIEU");

    res.render("ketoan/infothuephong", {
      title: "Vitamin Sea Hotel: Info thuê phòng",
      active: "tab1",
      phieu: result.recordsets[0][0],
      dsThueDV: result.recordsets[1],
      dsTonThat: result.recordsets[2],
      history: req.headers.referer,
      thanhToan: thanhToan.recordsets[0],
      thanhTien: thanhToan.recordsets[1][0],
      user: req.signedCookies.user
    });
  } catch (err) {
    next(err);
  } finally {
    await pool.close();
  }
};

function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, { encoding: "utf-8" }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function createPdf(dataHTML, path) {
  return new Promise((resolve, reject) => {
    pdf.create(dataHTML, { format: "Letter" }).toFile(path, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

module.exports.postDoanhThuNgay = async (req, res, next) => {
  var arr = req.body.ngay.split("-").map(x => parseInt(x));
  try {
    await pool.connect();
    var request = new sql.Request(pool);
    request.input("NGAY", arr[2]);
    request.input("THANG", arr[1]);
    request.input("NAM", arr[0]);

    var doanhThu = await request.execute("SP_DOANHTHU_NGAY");

    var templateDoanhThu = await readFile("./public/doanhthu/template.html");
    var bodyDoanhThu = doanhThu.recordsets[0].reduce((str, dt) => {
      return (str += `<tr style="text-align: center"><td style="border: 1px solid black">${dt.MAPHONG}</td><td style="border: 1px solid black">${dt.TIENPHONG}</td><td style="border: 1px solid black">${dt.TIENDICHVU}</td><td style="border: 1px solid black">${dt.DOANHTHUPHONG}</td></tr>`);
    }, "");
    var fileDoanhThuHTML = templateDoanhThu
      .replace("#loaidt", "NGÀY")
      .replace("#thoidiem", `${arr[2]}/${arr[1]}/${arr[0]}`)
      .replace("#body", bodyDoanhThu)
      .replace("#tongcong", doanhThu.recordsets[1][0].TONGDOANHTHU);

    var idBaoCaoDoanhThu = shortid.generate();

    var pathDT = await createPdf(
      fileDoanhThuHTML,
      `./public/doanhthu/ngay/${idBaoCaoDoanhThu}.pdf`
    );
    console.log(pathDT);

    res.render("ketoan/doanhthu", {
      title: "Vitamin Sea hotel: Doanh thu",
      loaiDoanhThu: "NGÀY",
      thoiDiem: `${arr[2]}/${arr[1]}/${arr[0]}`,
      dsDTPhong: doanhThu.recordset,
      tongDT: doanhThu.recordsets[1][0],
      idBaoCaoDoanhThu: idBaoCaoDoanhThu,
      user: req.signedCookies.user
    });
  } catch (err) {
    next(err);
  } finally {
    await pool.close();
  }
};

module.exports.postDoanhThuThang = async (req, res, next) => {
  try {
    await pool.connect();
    var request = new sql.Request(pool);
    request.input("THANG", parseInt(req.body.THANG));
    request.input("NAM", parseInt(req.body.NAM));

    var doanhThu = await request.execute("SP_DOANHTHU_THANG");

    var templateDoanhThu = await readFile("./public/doanhthu/template.html");
    var bodyDoanhThu = doanhThu.recordsets[0].reduce((str, dt) => {
      return (str += `<tr style="text-align: center"><td style="border: 1px solid black">${dt.MAPHONG}</td><td style="border: 1px solid black">${dt.TIENPHONG}</td><td style="border: 1px solid black">${dt.TIENDICHVU}</td><td style="border: 1px solid black">${dt.DOANHTHUPHONG}</td></tr>`);
    }, "");
    var fileDoanhThuHTML = templateDoanhThu
      .replace("#loaidt", "THÁNG")
      .replace("#thoidiem", req.body.THANG + "/" + req.body.NAM)
      .replace("#body", bodyDoanhThu)
      .replace("#tongcong", doanhThu.recordsets[1][0].TONGDOANHTHU);

    var idBaoCaoDoanhThu = shortid.generate();
    var pathDT = await createPdf(
      fileDoanhThuHTML,
      `./public/doanhthu/thang/${idBaoCaoDoanhThu}.pdf`
    );
    console.log(pathDT);

    res.render("ketoan/doanhthu", {
      loaiDoanhThu: "THÁNG",
      thoiDiem: req.body.THANG + "/" + req.body.NAM,
      dsDTPhong: doanhThu.recordset,
      tongDT: doanhThu.recordsets[1][0],
      idBaoCaoDoanhThu: idBaoCaoDoanhThu,
      user: req.signedCookies.user
    });
  } catch (err) {
    next(err);
  } finally {
    await pool.close();
  }
};

module.exports.postDoanhThuNam = async (req, res, next) => {
  try {
    await pool.connect();
    var request = new sql.Request(pool);
    request.input("NAM", parseInt(req.body.NAM));

    var doanhThu = await request.execute("SP_DOANHTHU_NAM");

    var templateDoanhThu = await readFile("./public/doanhthu/template.html");
    var bodyDoanhThu = doanhThu.recordsets[0].reduce((str, dt) => {
      return (str += `<tr style="text-align: center"><td style="border: 1px solid black">${dt.MAPHONG}</td><td style="border: 1px solid black">${dt.TIENPHONG}</td><td style="border: 1px solid black">${dt.TIENDICHVU}</td><td style="border: 1px solid black">${dt.DOANHTHUPHONG}</td></tr>`);
    }, "");
    var fileDoanhThuHTML = templateDoanhThu
      .replace("#loaidt", "NĂM")
      .replace("#thoidiem", req.body.NAM)
      .replace("#body", bodyDoanhThu)
      .replace("#tongcong", doanhThu.recordsets[1][0].TONGDOANHTHU);

    var idBaoCaoDoanhThu = shortid.generate();
    var pathDT = await createPdf(
      fileDoanhThuHTML,
      `./public/doanhthu/nam/${idBaoCaoDoanhThu}.pdf`
    );
    console.log(pathDT);

    res.render("ketoan/doanhthu", {
      loaiDoanhThu: "NĂM",
      thoiDiem: req.body.NAM,
      dsDTPhong: doanhThu.recordset,
      tongDT: doanhThu.recordsets[1][0],
      idBaoCaoDoanhThu: idBaoCaoDoanhThu,
      user: req.signedCookies.user
    });
  } catch (err) {
    next(err);
  } finally {
    await pool.close();
  }
};
