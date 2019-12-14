const sql = require("mssql");
const fs = require("fs");
const shortid = require("shortid");
const pdf = require("html-pdf");

const pool = require("../connectDB");

module.exports.index = async (req, res, next) => {
  try {
    await pool.connect();
    var request = new sql.Request(pool);
    var result = await request.execute("SP_DANHSACHPHONG_TRANGTHAI");
  } catch (err) {
    next(err);
  } finally {
    await pool.close();
  }

  res.render("letan/index", {
    title: "Vitamin Sea: Phòng",
    active: "tab1",
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
    var result = await request.execute("SP_THONGTIN_ALL_KHACH");
    var dsQuocTich = await requestQuocTich.execute("SP_XUAT_QUOCTICH");
  } catch (err) {
    next(err);
  } finally {
    await pool.close();
  }
  res.render("letan/khach", {
    title: "Vitamin Sea: Khách",
    active: "tab2",
    dsQT: dsQuocTich.recordset,
    dsKhach: result.recordset
  });
};

module.exports.getKhachSearch = async (req, res, nex) => {
  var keys = Object.keys(req.query);
  var data = req.query;
  for (let key of keys) {
    if (data[key] === "") {
      data[key] = null;
    }
  }
  if (data.MA !== null) {
    data.MA = parseInt(data.MA);
  }

  try {
    await pool.connect();
    var request = new sql.Request(pool);
    var requestQuocTich = new sql.Request(pool);
    for (let key of keys) {
      if (data[key] !== null) {
        request.input(`${key}`, data[key]);
      }
    }
    var result = await request.execute("SP_TIMKIEM_KHACH2");
    var dsQuocTich = await requestQuocTich.execute("SP_XUAT_QUOCTICH");
  } catch (err) {
    next(err);
  } finally {
    await pool.close();
  }
  res.render("letan/khach", {
    title: "Vitamin Sea: Khách",
    active: "tab2",
    values: data,
    dsQT: dsQuocTich.recordset,
    dsKhach: result.recordset
  });
};

module.exports.getPhong = async (req, res, next) => {
  try {
    await pool.connect();
    var request = new sql.Request(pool);
    request.input("MAPHONG", req.params.maphong);
    var phongInfo = await request.execute("SP_XUAT_THONGTIN_PHONG");
    var thuePhongInfo = await request.execute("SP_KHACH_THUEPHONG");
    var request2 = new sql.Request(pool);
    var dsTrangThai = await request2.execute("SP_DANHSACH_TRANGTHAI");
  } catch (err) {
    next(err);
  } finally {
    await pool.close();
  }
  res.render("letan/phong", {
    title: "Vitamin Sea: Phòng",
    active: "tab1",
    phong: phongInfo.recordsets[0][0],
    dsVatTu: phongInfo.recordsets[1],
    thuePhongInfo: thuePhongInfo.recordset[0],
    dichVuThue: thuePhongInfo.recordsets[1],
    dsTrangThai: dsTrangThai.recordset
  });
};

module.exports.getThuePhong = async (req, res, next) => {
  var phong = null;
  if (req.headers.referer) {
    phong = req.headers.referer.split("/").pop();
  }
  try {
    await pool.connect();
    var request = new sql.Request(pool);
    var dsThuePhong = await request.execute("SP_DANHSACH_THUEPHONG");
  } catch (err) {
    next(err);
  } finally {
    await pool.close();
  }

  res.render("letan/thuephong", {
    title: "Vitamin Sea: Thuê phòng",
    active: "tab1",
    dsThue: dsThuePhong.recordset,
    phong: phong
  });
};

module.exports.postThuePhong = async (req, res, next) => {
  var data = req.body;
  for (let i in data) {
    if (data[i] === "") {
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
    request.input("MANV", "FO001");
    await request.execute("SP_THEMPHIEU");

    res.redirect(`/letan/phong/${data.MAPHONG}`);
  } catch (err) {
    next(err);
  } finally {
    await pool.close();
  }
};

module.exports.getThemDichVu = async (req, res, next) => {
  var phong = null;
  if (req.headers.referer) {
    phong = req.headers.referer.split("/").pop();
  }
  try {
    await pool.connect();
    var request = new sql.Request(pool);
    var dsDichVu = await request.execute("SP_DANHSACH_DICHVU");
    // var dsPhongDangThue = await request.execute('SP_DANHSACH_PHONGDUOCTHUE');
  } catch (err) {
    next(err);
  } finally {
    await pool.close();
  }

  res.render("letan/themdichvu", {
    title: "Vitamin Sea: Thêm dịch vụ",
    active: "tab1",
    dsDichVu: dsDichVu.recordset,
    phong: phong
  });
};

module.exports.postThemDichVu = async (req, res, next) => {
  var data = req.body;
  for (let i in data) {
    if (data[i] === "") {
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
    await request.execute("SP_THEM_THUE_DICHVU");

    res.redirect(`/letan/phong/${data.MAPHONG}`);
  } catch (err) {
    next(err);
  } finally {
    await pool.close();
  }
};

module.exports.getTraPhong = async (req, res, next) => {
  var phong = null;
  if (req.headers.referer) {
    phong = req.headers.referer.split("/").pop();
  }

  try {
    await pool.connect();
    var request = new sql.Request(pool);
    // var dsPhongDangThue = await request.execute('SP_DANHSACH_PHONGDUOCTHUE');
    var dsVatTu = await request.execute("SP_DANHSACH_VATTU");
  } catch (err) {
    next(err);
  } finally {
    await pool.close();
  }

  res.render("letan/traphong", {
    title: "Vitamin Sea: Trả phòng",
    active: "tab1",
    dsVatTu: dsVatTu.recordset,
    phong: phong
  });
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

module.exports.postTraPhong = async (req, res, next) => {
  var data = req.body;
  for (let i in data) {
    if (data[i] === "") {
      data[i] = null;
    }
  }
  if (data.tonthat) {
    data.tonthat = JSON.parse(
      `{${data.tonthat.slice(0, data.tonthat.length - 1)}}`
    );
  }
  try {
    await pool.connect();
    var request1 = new sql.Request(pool);
    request1.input("MAPHONG", data.MAPHONG);
    request1.input("MANV", "FO001");
    await request1.execute("SP_TRAPHONG_B1"); // trả phòng bước 1

    if (data.tonthat) {
      // trả phòng bước 2
      for (let tt in data.tonthat) {
        var request2 = new sql.Request(pool);
        request2.input("MAPHONG", data.MAPHONG);
        request2.input("MAVT", tt);
        request2.input("SL", data.tonthat[tt]);
        await request2.execute("SP_TRAPHONG_B2_TONTHAT");
      }
    }

    var request3 = new sql.Request(pool);
    request3.input("MAPHONG", data.MAPHONG);
    var hoaDon = await request3.execute("SP_TRAPHONG_B3_HOADON"); // trả phòng bước 3
    // luu hóa đơn
    var templateHoaDon = await readFile("./public/hoadon/template.html");
    var bodyHoaDon = hoaDon.recordsets[1].reduce((str, dt) => {
      return (str += `<tr><td style="border: 1px solid black; text-align: center">${dt.DOITUONG}</td><td style="border: 1px solid black; text-align: center">${dt.LOAI}</td><td style="border: 1px solid black; text-align: center">${dt.SOLUONG}</td><td style="border: 1px solid black; text-align: right">${dt.DONGIA}</td><td style="border: 1px solid black; text-align: right">${dt.THANHTIEN}</td></tr>`);
    }, "");
    var fileHoaDonHTML = templateHoaDon
      .replace("#sophieu", hoaDon.recordset[0].SO_PHIEU)
      .replace("#tenkhach", hoaDon.recordset[0].HOTEN_KHACH)
      .replace("#cmnd_passport", hoaDon.recordset[0]["CMND/PASSPORT"])
      .replace("#quoctich", hoaDon.recordset[0].QUOCTICH)
      .replace("#dienthoai", hoaDon.recordset[0].DIENTHOAI)
      .replace("#body", bodyHoaDon)
      .replace("#tongcong", hoaDon.recordsets[2][0].TONGTIEN)
      .replace("#tongtien", hoaDon.recordsets[2][0].TONGTIENTHANHTOAN)
      .replace("#ngay", hoaDon.recordsets[3][0].NGAY)
      .replace("#thang", hoaDon.recordsets[3][0].THANG)
      .replace("#nam", hoaDon.recordsets[3][0].NAM);

    // pdf.create(fileHoaDonHTML, { format: 'Letter' }).toFile(`./public/hoadon/${hoaDon.recordset[0].SO_PHIEU}.pdf`, function(err, res) {
    //   if (err) return console.log(err);
    //   console.log(res);
    // });
    var pathHD = await createPdf(
      fileHoaDonHTML,
      `./public/hoadon/${hoaDon.recordset[0].SO_PHIEU}.pdf`
    );
    console.log(pathHD);

    var request4 = new sql.Request(pool);
    request4.input("MAPHONG", data.MAPHONG);
    await request4.execute("SP_TRAPHONG_B4"); // trả phòng bước 4

    res.redirect(`/hoadon/${hoaDon.recordset[0].SO_PHIEU}.pdf`);
  } catch (err) {
    next(err);
  } finally {
    await pool.close();
  }
};

module.exports.postPhong = async (req, res, next) => {
  var phong = req.params.maphong;
  try {
    await pool.connect();
    var request = new sql.Request(pool);
    request.input("MAPHONG", phong);
    request.input("MA_TT", req.body.MA_TT);
    await request.execute("SP_CAPNHAT_TRANGTHAIPHONG");
    res.redirect(`/letan/phong/${phong}`);
  } catch (err) {
    next(err);
  } finally {
    await pool.close();
  }
};

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

    // pdf.create(fileDoanhThuHTML, { format: 'Letter' }).toFile(`./public/doanhthu/ngay/${idBaoCaoDoanhThu}.pdf`, function(err, res) {
    //   if (err) return console.log(err);
    //   console.log(res);
    // });
    var pathDT = await createPdf(
      fileDoanhThuHTML,
      `./public/doanhthu/ngay/${idBaoCaoDoanhThu}.pdf`
    );
    console.log(pathDT);

    res.render("letan/doanhthu", {
      loaiDoanhThu: "NGÀY",
      thoiDiem: `${arr[2]}/${arr[1]}/${arr[0]}`,
      dsDTPhong: doanhThu.recordset,
      tongDT: doanhThu.recordsets[1][0],
      idBaoCaoDoanhThu: idBaoCaoDoanhThu
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
    // pdf.create(fileDoanhThuHTML, { format: 'Letter' }).toFile(`./public/doanhthu/thang/${idBaoCaoDoanhThu}.pdf`, function(err, res) {
    //   if (err) return console.log(err);
    //   console.log(res);
    // });
    var pathDT = await createPdf(
      fileDoanhThuHTML,
      `./public/doanhthu/thang/${idBaoCaoDoanhThu}.pdf`
    );
    console.log(pathDT);

    res.render("letan/doanhthu", {
      loaiDoanhThu: "THÁNG",
      thoiDiem: req.body.THANG + "/" + req.body.NAM,
      dsDTPhong: doanhThu.recordset,
      tongDT: doanhThu.recordsets[1][0],
      idBaoCaoDoanhThu: idBaoCaoDoanhThu
    });
  } catch (err) {
    next(err);
  } finally {
    await pool.close();
  }
};
