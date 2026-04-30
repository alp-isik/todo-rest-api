var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const swaggerUI = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");

require("dotenv").config();
var db = require("./models");

// Sync database tables, then seed statuses if they don't exist yet
db.sequelize.sync({ alter: true }).then(async () => {
  const STATUSES = ["Not Started", "Started", "Completed", "Deleted"];

  for (const status of STATUSES) {
    await db.Status.findOrCreate({ where: { status } });
  }
});

var usersRouter = require("./routes/users");
var todosRouter = require("./routes/todos");
var categoryRouter = require("./routes/category");

var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/users", usersRouter);
app.use("/todos", todosRouter);
app.use("/category", categoryRouter);

app.use("/doc", swaggerUI.serve, swaggerUI.setup(swaggerFile));

// catch 404
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
