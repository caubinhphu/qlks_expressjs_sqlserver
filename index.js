const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const leTanRoute = require("./routers/letan.router");
const authRoute = require("./routers/auth.router");
const keToanRoute = require("./routers/ketoan.router");
const vatTuRoute = require('./routers/vattu.router');

const authMiddleware = require("./middlewares/auth.middleware");
const isLeTanMiddleWare = require('./middlewares/isletan.middleware');
const isKeToanMiddleware = require('./middlewares/isketoan.middleware');
const isVatTuMiddleware = require('./middlewares/isvattu.middleware');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser("ashdgf33%^aasdf"));

app.set("views", "./views");
app.set("view engine", "pug");
app.use(express.static("public"));

app.get("/", (req, res, next) => res.redirect("/login"));

app.use("/login", authRoute);
app.use("/letan", authMiddleware.login, isLeTanMiddleWare.isLeTan, leTanRoute);
app.use("/ketoan", authMiddleware.login, isKeToanMiddleware.isKeToan, keToanRoute);
app.use('/vattu', authMiddleware.login, isVatTuMiddleware.isVatTu, vatTuRoute);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).render("errors", {
    title: "Errors",
    err: err
  });
});

app.listen(3000, () => console.log("Server is running"));
