require('dotenv').config()

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const post = process.env.PORT || 3000;

const leTanRoute = require("./routers/letan.router");
const authRoute = require("./routers/auth.router");
const keToanRoute = require("./routers/ketoan.router");
const vatTuRoute = require('./routers/vattu.router');
const quanLyRoute = require('./routers/quanly.router');

const loggerMiddleware = require('./middlewares/logger.middleware');
const authMiddleware = require("./middlewares/auth.middleware");
const isLeTanMiddleWare = require('./middlewares/isletan.middleware');
const isKeToanMiddleware = require('./middlewares/isketoan.middleware');
const isVatTuMiddleware = require('./middlewares/isvattu.middleware');
const isQuanLyMiddleware = require('./middlewares/isquanly.middleware');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SECRET));

app.set("views", "./views");
app.set("view engine", "pug");
app.use(express.static("public"));

app.get("/", (req, res, next) => res.redirect("/login"));

// app.use(loggerMiddleware);

app.use("/login", loggerMiddleware, authRoute);
app.use("/letan", authMiddleware.login, loggerMiddleware, isLeTanMiddleWare.isLeTan, leTanRoute);
app.use("/ketoan", authMiddleware.login, loggerMiddleware, isKeToanMiddleware.isKeToan, keToanRoute);
app.use('/vattu', authMiddleware.login, loggerMiddleware, isVatTuMiddleware.isVatTu, vatTuRoute);
app.use('/quanly', authMiddleware.login, loggerMiddleware, isQuanLyMiddleware.isQuanLy, quanLyRoute);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).render("errors", {
    title: "Errors",
    err: err
  });
});

app.listen(post, () => console.log("Server is running"));
